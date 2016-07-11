import { ApplicationFragment } from 'common/application/fragments';
import { AcceptBus, WrapBus } from 'mesh';
import CoreObject from 'common/object';
import sift from 'sift';

export const fragment = ApplicationFragment.create('sfnFileHandler', create);

class SfnFile extends CoreObject {

}

function create(app) {

  const logger = app.logger.createChild({ prefix: 'sfn file handler: '});

  app.busses.push(
    AcceptBus.create(
      sift({ type: 'createFileModel', fileType: 'sfn' }),
      WrapBus.create(onSfnFile)
    )
  );

  function onSfnFile({ filepath }) {
    logger.info('handling %s', filepath);
    return SfnFile.create({ filepath });
  }
}
