import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus } from 'common/busses';
import gaze from 'gaze';
import fs from 'fs';

export const fragment = ApplicationFragment.create('openFile', createOpenFileHandler);

function createOpenFileHandler(app) {
  app.bus.push(TypeCallbackBus.create('openFile', onOpenFile));

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
    app.logger.info('opening file %s', filepath);

    // pass the file onto specific file handlers
    app.bus.execute({
      type     : 'fileContent',
      public   : true,
      filepath : filepath,
      content  : fs.readFileSync(filepath, 'utf8')
    });
  }
}
