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
} from "tandem-common";

@loggable()
export default class FileService extends BaseApplicationService<IApplication> {

  public logger:Logger;
  private _fileWatchers: Object = {};
  private _fileCache: Object = {};

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  [UpdateTemporaryFileContentAction.UPDATE_TEMP_FILE_CONTENT] (action: UpdateTemporaryFileContentAction) {
    this._fileCache[action.path] = { path: action.path, content: action.content, mtime: Date.now() };
    this.logger.info("updating cached content for %s", action.path);
    const watcher = this._fileWatchers[action.path];
    if (watcher) {
      this._fileWatchers[action.path].forEach((writable) => writable.write(this._fileCache[action.path]));
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
    watcher.close();
  }

  /**
   */

  @document("watches a file for any changes")
  [WatchFileAction.WATCH_FILE](action: WatchFileAction) {
    return Response.create((writable) => {
      if (!this._fileWatchers[action.path]) {
        this._fileWatchers[action.path] = [];
      }
      this._fileWatchers[action.path].push(writable);
      const watcher = gaze(action.path, (err, w) => {
        const cancel = () => {
          this._fileWatchers[action.path].splice(this._fileWatchers[action.path].indexOf(writable), 1);
          if (this._fileWatchers[action.path].length === 0) {
            this._fileWatchers[action.path] = undefined;
          }
          this._closeFileWatcher(watcher, action);
        }
        writable.then(cancel);
        w.on("all", async () => {
          try {
            this._fileCache[action.path] = null;
            const data = this._fileCache[action.path] = await ReadFileAction.execute(action, this.bus);
            await writable.write(data);
          } catch (e) {
            cancel();
          }
        });
      });
    });
  }
}

export const fileServicerDependency = new ApplicationServiceDependency("file", FileService);
