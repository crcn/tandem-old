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
  Injector,
  filterAction,
  PostDSAction,
  DSFindAction,
  DSUpdateAction,
  DSInsertAction,
  DSRemoveAction,
  InjectorProvider,
  ApplicationServiceProvider,
} from "@tandem/common";


const FILES_COLLECTION_NAME = "files";

import {
  LocalFileSystem,
  FileSystemProvider,
  FileEditorProvider,
  ApplyFileEditAction,
  IFileSystem,
  ReadFileAction,
  WatchFileAction,
} from "@tandem/sandbox";

@loggable()
export class FileService extends CoreApplicationService<IEdtorServerConfig> {

  protected readonly logger: Logger;

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

  /**
   */


  [ApplyFileEditAction.APPLY_EDITS]({ actions }: ApplyFileEditAction) {
    return FileEditorProvider.getInstance(this.injector).applyEditActions(...actions);
  }
}
