import * as fs from 'fs';
import * as gaze from 'gaze';
import * as sift from 'sift';

import Logger from 'saffron-common/lib/logger/index';
import loggable from 'saffron-common/lib/decorators/loggable';
import isPublic from 'saffron-common/lib/actors/decorators/public';
import filterAction from 'saffron-common/lib/actors/decorators/filter-action';
import document from 'saffron-common/lib/actors/decorators/document';
import BaseApplicationService from 'saffron-common/lib/services/base-application-service';

import { Response } from 'mesh';
import IApplication from 'saffron-common/lib/application/interface';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
import { UpsertAction } from 'saffron-common/lib/actions/index';

@loggable
export default class FileService extends BaseApplicationService<IApplication> {

  public logger:Logger;
  private _watchers:Object = {};

  /**
   */

  @isPublic
  @document('opens a file')
  openFile(action) {
    this.logger.info(`opening ${action.path}`);

    if (action.watch) {
      this._watch(action);
    }

    var data = this.readFile(action);

    return this.bus.execute(new UpsertAction('files', data, { path: data.path }));
  }

  /**
   */

  @isPublic
  @document('reads a file content')
  readFile(action) {
    return {
      path    : action.path,
      ext     : action.path.split('.').pop(),
      content : fs.readFileSync(action.path, 'utf8')
    };
  }

  /**
   * when an item has been removed from the db, close
   * the file watcher if it exists
   */

  @filterAction(sift({ collectionName: 'files' }))
  didRemove(action) {
    for (var item of action.data) {
      if (this._watchers[item.path]) {
        this._closeFileWatcher(this._watchers[item.path], item);
      }
    }
  }

  _closeFileWatcher(watcher, item) {
    this.logger.info('closing file watcher for %s', item.path);
    watcher.close();
  }

  /**
   */

  @isPublic
  @document('watches a file for any changes')
  watchFile(action) {
    return Response.create((writable) => {
      var watcher = gaze(action.path, (err, w) => {
        w.on('all', async () => {
          try { 
            await writable.write({ type: 'fileChange' });
          } catch (e) {
            this._closeFileWatcher(watcher, action);
          }
        });
      });
    });
  }

  /**
   */

  _watch(action) {
    if (this._watchers[action.path]) return;
    this._watchers[action.path] = gaze(action.path, (err, watcher) => {
      watcher.on('all', this.openFile.bind(this, action));
    });
  }
}

export const fragment = new ClassFactoryFragment('application/services/file', FileService);
