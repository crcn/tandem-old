import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus } from 'common/mesh';
import { BufferedResponse } from 'mesh';
import gaze from 'gaze';
import fs from 'fs';

export const fragment = ApplicationFragment.create('openFile', createOpenFileHandler);

function createOpenFileHandler(app) {
  app.busses.push(TypeCallbackBus.create('openFile', onOpenFile));
  app.busses.push(TypeCallbackBus.create('closeFile', onCloseFile));
  app.busses.push(TypeCallbackBus.create('getOpenFiles', onGetOpenFiles));

  const logger = app.logger.createChild({ prefix: 'file handler ' });
  const openFiles = {};

  function onOpenFile({ filepath, watch }) {

    if (watch) {
      watchFile(filepath);
    }

    openFile(filepath);
  }

  function watchFile(filepath) {
    gaze(filepath, function(err, watcher) {
      watcher.on('all', openFile.bind(this, filepath));
    })
  }

  function openFile(filepath) {
    logger.info('opening %s', filepath);

    var fileInfo = {
      path     : filepath,
      type     : filepath.split('.').pop(),
      content  : fs.readFileSync(filepath, 'utf8')
    };

    openFiles[fileInfo] = fileInfo;

    // pass the file onto specific file handlers
    app.bus.execute({
      type     : 'handleFileContent',
      public   : true,
      file     : fileInfo
    });
  }

  function onCloseFile(event) {
    throw new Error('cannot close files yet');
  }

  function onGetOpenFiles(event) {
    return BufferedResponse.create(void 0, Object.values(openFiles));
  }
}
