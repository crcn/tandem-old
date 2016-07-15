import fs from 'fs';
import gaze from 'gaze';
import sift from 'sift';
import Service from 'common/services/base';
import loggable from 'common/logger/mixins/loggable';
import isPublic from 'common/actors/decorators/public';
import filterAction from 'common/actors/decorators/filter-action';
import document from 'common/actors/decorators/document';

import { FactoryFragment } from 'common/fragments';

@loggable
export default class FileService extends Service {

  constructor(properties) {
    super(properties);
    this._watchers = {};
  }

  /**
   */

  @isPublic
  @document('opens a file')
  openFile(action) {
    this.logger.info(`opening ${action.src}`);

    if (action.watch) {
      this._watch(action);
    }

    var data = {
      path    : action.src,
      content : fs.readFileSync(action.src, 'utf8')
    };

    return this.bus.execute({
      type: 'upsert',
      collectionName: 'files',
      query: { path: data.path },
      data: data
    });
  }

  /**
   * when an item has been removed from the db, close
   * the file watcher if it exists
   */

  @filterAction(sift({ collectionName: 'files' }))
  didRemove(action) {
    for (var item of action.data) {
      if (this._watchers[item.path]) {
        this.logger.info('closing file watcher for %s', item.path);
        this._watchers[item.path].close();
      }
    }
  }

  /**
   */

  _watch(action) {
    if (this._watchers[action.src]) return;
    this._watchers[action.src] = gaze(action.src, (err, watcher) => {
      watcher.on('all', this.openFile.bind(this, action));
    });
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/actors/file',
  factory: FileService
});
