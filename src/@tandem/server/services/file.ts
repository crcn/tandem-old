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
  DSFindAction,
  DSUpdateAction,
  DSInsertAction,
  DSRemoveAction,
  DependenciesDependency,
  BaseApplicationService,
  ApplicationServiceDependency,
} from "@tandem/common";


const FILES_COLLECTION_NAME = "files";

import { LocalFileSystem, FileSystemDependency, IFileSystem, ReadFileAction, WatchFileAction } from "@tandem/sandbox";

@loggable()
export default class FileService extends BaseApplicationService<IApplication> {

  public logger:Logger;

  @inject(FileSystemDependency.NS)
  private _fileSystem: IFileSystem;

  /**
   */

  @document("reads a file content")
  [ReadFileAction.READ_FILE](action: ReadFileAction|WatchFileAction) {
    this.logger.info("reading file %s", action.filePath);
    return this._fileSystem.readFile(action.filePath);
  }

  /**
   */

  @document("watches a file for any changes")
  [WatchFileAction.WATCH_FILE](action: WatchFileAction) {
    this.logger.info("watching file %s", action.filePath);
    return Response.create((writable) => {

      const watcher = this._fileSystem.watchFile(action.filePath, () => {
        writable.write();
      });

      writable.then(watcher.dispose.bind(this));
    });
  }
}

export const fileServicerDependency = new ApplicationServiceDependency("file", FileService);
