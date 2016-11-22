import * as fs from "fs";
import * as gaze from "gaze";
import * as sift from "sift";
import { btoa, atob } from "abab"
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
  PostDSMessage,
  InjectorProvider,
  ApplicationServiceProvider,
} from "@tandem/common";


const FILES_COLLECTION_NAME = "files";

import {
  IFileSystem,
  ReadFileRequest,
  LocalFileSystem,
  WatchFileRequest,
  FileSystemProvider,
  FileEditorProvider,
  ReadDirectoryRequest,
  ApplyFileEditRequest,
} from "@tandem/sandbox";

@loggable()
export class FileService extends CoreApplicationService<IEdtorServerConfig> {

  protected readonly logger: Logger;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;
  /**
   */

  async [ReadFileRequest.READ_FILE](action: ReadFileRequest|WatchFileRequest) {
    return new Buffer(await this._fileSystem.readFile(action.filePath)).toString("base64");
  }

  /**
   */

  [ReadDirectoryRequest.READ_DIRECTORY](action: ReadDirectoryRequest) {
    return this._fileSystem.readDirectory(action.directoryPath);
  }

  /**
   */

  @document("watches a file for any changes")
  [WatchFileRequest.WATCH_FILE](action: WatchFileRequest) {
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


  [ApplyFileEditRequest.APPLY_EDITS]({ mutations }: ApplyFileEditRequest) {
    return FileEditorProvider.getInstance(this.injector).applyMutations(...mutations);
  }
}
