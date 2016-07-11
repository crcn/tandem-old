import { ApplicationFragment } from 'common/application/fragments';
import { INITIALIZE } from 'common/application/events';
import { TypeCallbackBus } from 'common/mesh';


export const fragment = ApplicationFragment.create('fileHandler', create);

function create(app) {
  app.busses.push(
    TypeCallbackBus.create(INITIALIZE, initialize),
    TypeCallbackBus.create('handleFileContent', openFile)
  );

  const logger = app.logger.createChild({ prefix: 'file handler: ' });
  var openFiles = [];

  async function initialize(event) {
    await getOpenFiles();
  }

  async function getOpenFiles() {
    var files = await app.bus.execute({
      type: 'getOpenFiles',
      public: true
    }).readAll();

    for (const file of files) {
      await openFile(file);
    }
  }

  async function openFile(file) {

    var model = openFiles.find(sift({ filepath: file.filepath }));

    if (model) {
      logger.info('updating file %s', file.filepath);
      logger.info(file.content); 
      model.setProperties(file);
      return;
    }

    model = (await app.bus.execute({
      type: 'createFileModel',
      ...file
    }).readAll())[0];

    if (!model) {
      logger.error('cannot open file %s', file.filepath);
      return;
    }

    openFiles.push(model);
  }
}
