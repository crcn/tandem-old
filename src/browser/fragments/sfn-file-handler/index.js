import { ApplicationFragment } from 'common/application/fragments';
import { FilterBus, CallbackBus } from 'common/busses';
import sift from 'sift';

export const fragment = ApplicationFragment.create('sfnFileHandler', create);

function create(app) {

  const logger = app.logger.createChild({ prefix: 'sfn file handler '});

  app.bus.push(
    FilterBus.create(
      sift({ type: 'fileContent', fileType: 'sfn' }),
      CallbackBus.create(onSfnFile)
    )
  );

  function onSfnFile(event) {
    logger.info('content');
  }
}
