import * as fs from "fs";
import * as gaze from "gaze";
import * as sift from "sift";
import { Response } from "mesh";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/core";
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
  DependenciesProvider,
  BaseApplicationService,
  ApplicationServiceProvider,
} from "@tandem/common";


const FILES_COLLECTION_NAME = "files";

import { LocalFileSystem, FileSystemProvider, IFileSystem, ReadFileAction, WatchFileAction } from "@tandem/sandbox";

export class FileService extends CoreApplicationService<IEdtorServerConfig> {

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  /**
   */

  @document("reads a file content")
  [ReadFileAction.READ_FILE](action: ReadFileAction|WatchFileAction) {
    return this._fileSystem.readFile(action.filePath);
  }

  /**
   */

  @document("watches a file for any changes")
  [WatchFileAction.WATCH_FILE](action: WatchFileAction) {
    console.log("watching file %s", action.filePath);
    return Response.create((writable) => {

      const watcher = this._fileSystem.watchFile(action.filePath, () => {
        writable.write();
      });

      writable.then(watcher.dispose.bind(this));
    });
  }
}
