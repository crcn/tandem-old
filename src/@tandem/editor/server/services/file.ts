import * as fs from "fs";
import * as gaze from "gaze";
import * as sift from "sift";
import * as btoa from "btoa"
import { DuplexStream } from "@tandem/mesh";
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
  InjectorProvider,
  ApplicationServiceProvider,
} from "@tandem/common";


const FILES_COLLECTION_NAME = "files";

import {
  IFileSystem,
  ReadFileAction,
  LocalFileSystem,
  WatchFileAction,
  FileSystemProvider,
  FileEditorProvider,
  ReadDirectoryAction,
  ApplyFileEditAction,
} from "@tandem/sandbox";

@loggable()
export class FileService extends CoreApplicationService<IEdtorServerConfig> {

  protected readonly logger: Logger;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;
  /**
   */

  async [ReadFileAction.READ_FILE](action: ReadFileAction|WatchFileAction) {
    return btoa(await this._fileSystem.readFile(action.filePath));
  }

  /**
   */

  [ReadDirectoryAction.READ_DIRECTORY](action: ReadDirectoryAction) {
    return this._fileSystem.readDirectory(action.directoryPath);
  }

  /**
   */

  @document("watches a file for any changes")
  [WatchFileAction.WATCH_FILE](action: WatchFileAction) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();

      const watcher = this._fileSystem.watchFile(action.filePath, () => {
        writer.write({});
      });

      return {
        close() {
          watcher.dispose();
        }
      }
    });
  }

  /**
   */


  [ApplyFileEditAction.APPLY_EDITS]({ actions }: ApplyFileEditAction) {
    return FileEditorProvider.getInstance(this.injector).applyEditActions(...actions);
  }
}
