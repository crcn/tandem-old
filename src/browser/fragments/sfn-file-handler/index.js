import { ApplicationFragment } from 'common/application/fragments';
import { AcceptBus, WrapBus } from 'mesh';
import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import sift from 'sift';
import deserializeEntity from 'common/utils/entity/deserialize';

export const fragment = ApplicationFragment.create({
  ns: 'application/sfnFileHandler',
  initialize: create
});

@observable
class SfnFile extends CoreObject {
  constructor(properties) {
    super(properties);
    this.entity = this._deserialize(this.content);
  }

  didChange(changes) {
    var contentChange = changes.find(sift({ property: 'content' }));

    if (contentChange) {
      this.setProperties({ entity: this._deserialize(this.content) });
    }
  }

  _deserialize(content) {
    return deserializeEntity(content, this.app);
  }
}

function create(app) {

  const logger = app.logger.createChild({ prefix: 'sfn file handler: '});

  app.busses.push(
    AcceptBus.create(
      sift({ type: 'createFileModel', 'file.ext': 'sfn' }),
      WrapBus.create(createSfnFileModel)
    )
  );

  function createSfnFileModel({ file }) {
    return SfnFile.create({ ...file, bus: app.bus, app: app });
  }
}
