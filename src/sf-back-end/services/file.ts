import * as fs from "fs";
import * as gaze from "gaze";
import * as sift from "sift";
import { Logger } from "sf-core/logger";
import { Response } from "mesh";
import { SaveAction } from "sf-common/actions";
import { IApplication } from "sf-core/application";
import { BaseApplicationService } from "sf-core/services";
import { File, FILES_COLLECTION_NAME } from "sf-common/models";
import { inject, loggable, document, filterAction } from "sf-core/decorators";
import { PostDSAction, OpenFileAction, WatchFileAction } from "sf-core/actions";
import { ApplicationServiceDependency, Dependencies, DEPENDENCIES_NS } from "sf-core/dependencies";

@loggable()
export default class FileService extends BaseApplicationService<IApplication> {

  public logger:Logger;
  private _watchers:Object = {};
  private _openFiles: any = {};

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  /**
   */

  @document("opens a file")
  openFile(action: OpenFileAction) {
    this.logger.info(`opening ${action.path}`);

    if (action.watch) {
      this._watch(action);
    }

    const data = this.readFile(action);
    let file: File;

    if (!(file = this._openFiles[data.path])) {
      file = this._openFiles[data.path] = File.create(data, this._dependencies);
    } else {
      file.deserialize(data);
    }

    return file.save();
  }

  /**
   */
  @document("saves a file to disk")
  saveFile(action: SaveAction) {
    fs.writeFile(action.path, action.content);
  }

  /**
   */

  @document("reads a file content")
  readFile(action: OpenFileAction|WatchFileAction) {
    return {
      path    : action.path,
      content : fs.readFileSync(action.path, "utf8")
    };
  }

  /**
   * when an item has been removed from the db, close
   * the file watcher if it exists
   */

  @filterAction(sift({ collectionName: FILES_COLLECTION_NAME }))
  dsDidRemove(action: PostDSAction ) {
    const item = action.data;
    this._openFiles[item.path].dispose();
    this._openFiles[item.path] = undefined;
    if (this._watchers[item.path]) {
      this._closeFileWatcher(this._watchers[item.path], item);
    }
  }

  _closeFileWatcher(watcher, item) {
    this.logger.info("closing file watcher for %s", item.path);
    watcher.close();
  }

  /**
   */

  @document("watches a file for any changes")
  watchFile(action: WatchFileAction) {
    return Response.create((writable) => {
      const watcher = gaze(action.path, (err, w) => {
        const cancel = () => this._closeFileWatcher(watcher, action);
        writable.then(cancel);
        w.on("all", async () => {
          try {
            await writable.write(await this.readFile(action));
          } catch (e) {
            cancel();
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
      watcher.on("all", this.openFile.bind(this, action));
    });
  }
}

export const dependency = new ApplicationServiceDependency("file", FileService);
