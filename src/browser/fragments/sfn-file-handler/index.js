import { ApplicationFragment } from 'common/application/fragments';
import { AcceptBus, WrapBus } from 'mesh';
import SfnFile from './model';

export const fragment = ApplicationFragment.create({
  ns: 'application/sfnFileHandler',
  initialize: create,
});

function create(app) {

  app.busses.push(
    AcceptBus.create(
      sift({ type: 'createFileModel', 'file.ext': 'sfn' }),
      WrapBus.create(createSfnFileModel)
    )
  );

  function createSfnFileModel({ file }) {
    return SfnFile.create({ ...file, bus: app.bus, fragmentDictionary: app.fragmentDictionary.createChild() });
  }
}
