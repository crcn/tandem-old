import * as fs from "fs";
import * as gaze from "gaze";
import * as sift from "sift";
import { Response } from "mesh";
import {
  File,
  inject,
  Logger,
  loggable,
  document,
  filterAction,
  IApplication,
  PostDSAction,
  Dependencies,
  OpenFileAction,
  DSUpdateAction,
  ReadFileAction,
  WatchFileAction,
  DEPENDENCIES_NS,
  SaveAllFilesAction,
  BaseApplicationService,
  ApplicationServiceDependency,
  ReadTemporaryFileContentAction,
  UpdateTemporaryFileContentAction,
} from "@tandem/common";

@loggable()
export default class FileService extends BaseApplicationService<IApplication> {

  public logger:Logger;
  private _fileWatchers: Object = {};
  private _fileCache: Object = {};

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  [UpdateTemporaryFileContentAction.UPDATE_TEMP_FILE_CONTENT] (action: UpdateTemporaryFileContentAction) {
    this._fileCache[action.path] = { path: action.path, content: action.content, mtime: action.mtime };
    this.logger.info("updating cached content for %s", action.path);
    const watcher = this._fileWatchers[action.path];
    if (watcher) {
      this._fileWatchers[action.path].items.forEach((writable) => writable.write(this._fileCache[action.path]));
    }
  }

  /**
   */

  @document("saves a file to disk")
  [SaveAllFilesAction.SAVE_ALL_FILES](action: SaveAllFilesAction) {
    for (const key in this._fileCache) {
      this.logger.info("saving %s", key);
      fs.writeFileSync(key, this._fileCache[key].content);
    }
  }

  /**
   */

  @document("reads a file content")
  [ReadFileAction.READ_FILE](action: ReadFileAction|OpenFileAction|WatchFileAction) {
    this.logger.info("reading file %s", action.path);
    return this._fileCache[action.path] || {
      path    : action.path,
      mtime   : fs.lstatSync(action.path).mtime.getTime(),
      content : fs.readFileSync(action.path, "utf8")
    };
  }

  /**
   */

  [ReadTemporaryFileContentAction.READ_TEMP_FILE_CONTENT](action: ReadTemporaryFileContentAction) {
    return this._fileCache[action.path];
  }

  _closeFileWatcher(watcher, item) {
    this.logger.info("closing file watcher for %s", item.path);
    this._fileWatchers[item.path] = undefined;
    watcher.close();
  }

  /**
   */

  @document("watches a file for any changes")
  [WatchFileAction.WATCH_FILE](action: WatchFileAction) {
    return Response.create((writable) => {


      const { watcher, items } = this._fileWatchers[action.path] || (() => {
        const watcher = gaze(action.path, (err, w) => {
          w.on("all", async () => {
            try {
              this._fileCache[action.path] = null;
              UpdateTemporaryFileContentAction.execute(await ReadFileAction.execute(action.path, this.bus), this.app.bus);
            } catch (e) {
              cancel();
            }
          });
        });

        return this._fileWatchers[action.path] = { watcher: watcher, items: [] };
      })();

      const cancel = () => {
        items.splice(items.indexOf(writable), 1);
        if (items.length === 0) {
          this._closeFileWatcher(watcher, action);
        }
      }

      writable.then(cancel);
      items.push(writable);

    });
  }
}

export const fileServicerDependency = new ApplicationServiceDependency("file", FileService);
