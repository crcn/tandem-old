import { BaseStudioWorkerCommand } from "./base";
import { inject } from "@tandem/common";
import { FileCacheProvider, FileCache } from "@tandem/sandbox";

export class SyncFileCacheCommand extends BaseStudioWorkerCommand {
  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;
  execute() {
    this._fileCache.syncWithLocalFiles();
  }
} 