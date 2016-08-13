import * as fs from "fs";
import * as gaze from "gaze";
import * as sift from "sift";
import { Logger } from "sf-core/logger";
import { Response } from "mesh";
import { IApplication } from "sf-core/application";
import { PostDBAction } from "sf-core/actions";
import { BaseApplicationService } from "sf-core/services";
import { File, FILES_COLLECTION_NAME } from "sf-common/models";
import { inject, loggable, document, filterAction } from "sf-core/decorators";
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
  openFile(action) {
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

  @document("reads a file content")
  readFile(action) {
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
  didRemove(action: PostDBAction ) {
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
  watchFile(action) {
    return Response.create((writable) => {
      var watcher = gaze(action.path, (err, w) => {
        w.on("all", async () => {
          try {
            await writable.write({ type: "fileChange" });
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
      watcher.on("all", this.openFile.bind(this, action));
    });
  }
}

export const dependency = new ApplicationServiceDependency("file", FileService);
