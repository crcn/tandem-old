import fs from 'fs';
import gaze from 'gaze';
import glob from 'glob';

import { TypeCallbackBus } from 'common/mesh';
import { BufferedResponse } from 'mesh';
import { ApplicationFragment } from 'common/application/fragments';

export const fragment = ApplicationFragment.create({
  ns: 'application/openFile',
  initialize: createOpenFileHandler,
});

function createOpenFileHandler(app) {
  app.busses.push(
    TypeCallbackBus.create('openFile', onOpenFile),
    TypeCallbackBus.create('getFiles', getFiles),
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

    const fileInfo = getFile(filepath);

    openFiles[filepath] = fileInfo;

    // pass the file onto specific file handlers
    app.bus.execute({
      type     : 'handleFileContent',
      public   : true,
      file     : fileInfo,
    });
  }

  function onCloseFile() {
    throw new Error('cannot close files yet');
  }

  function getFiles(options) {
    return glob.sync(options.src).map(getFile);
  }

  function getFile(filepath) {
    return {
      path     : filepath,
      ext      : filepath.split('.').pop(),
      content  : fs.readFileSync(filepath, 'utf8'),
    };
  }

  function onGetOpenFiles() {
    return BufferedResponse.create(void 0, Object.values(openFiles));
  }
}
