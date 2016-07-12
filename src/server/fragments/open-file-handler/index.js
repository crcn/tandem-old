import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus } from 'common/mesh';
import gaze from 'gaze';
import fs from 'fs';

export const fragment = ApplicationFragment.create({
  ns: 'openFile',
  initialize: createOpenFileHandler,
});

function createOpenFileHandler(app) {

  app.busses.push(
    TypeCallbackBus.create('openFile', onOpenFile),
    TypeCallbackBus.create('closeFile', onCloseFile),
    TypeCallbackBus.create('getOpenFiles', onGetOpenFiles)
  );

  const logger = app.logger.createChild({ prefix: 'file handler ' });
  const openFiles = {};

  function onOpenFile({ filepath, watch }) {

    if (watch) {
      watchFile(filepath);
    }

    openFile(filepath);
  }

  function watchFile(filepath) {
    gaze(filepath, function (err, watcher) {
      watcher.on('all', openFile.bind(this, filepath));
    });
  }

  function openFile(filepath) {
    logger.info('opening %s', filepath);

    var fileInfo = {
      filepath : filepath,
      fileType : filepath.split('.').pop(),
      content  : fs.readFileSync(filepath, 'utf8'),
    };

    openFiles[fileInfo] = fileInfo;

    // pass the file onto specific file handlers
    app.bus.execute({
      type     : 'fileContent',
      public   : true,
      ...fileInfo,
    });
  }

  function onCloseFile(event) {
    throw new Error('cannot close files yet');
  }

  async function onGetOpenFiles(event) {
    console.log('get open files');
    return 'barg';
  }
}
