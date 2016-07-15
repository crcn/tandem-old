import BaseService from 'common/services/base';
import { FactoryFragment } from 'common/fragments';
import loggable from 'common/logger/mixins/loggable';
import fs from 'fs';
import { Response } from 'mesh';
import gaze from 'gaze';

@loggable
export default class FileService extends BaseService {

  /**
   */

  openFile(action) {
    this.logger.info(`opening ${action.src}`);

    var data = {
      path    : action.src,
      content : fs.readFileSync(action.src, 'utf8')
    };

    return this.bus.execute({
      type: 'insert',
      collectionName: 'files',
      data: data
    });
  }

  // watchFile(action) {
  //   return Response.create((writable) => {
  //     gaze(action.path, (watcher) => {
  //       watcher.on('all', () => {
  //         writable.write({
  //           type: 'change'
  //         });
  //       });
  //     })
  //   });
  // }
}

export const fragment = FactoryFragment.create({
  ns: 'application/actors/file',
  factory: FileService
})
