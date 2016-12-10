import { BaseTDProjectExtensionCommand } from "./base";
import { DSFindRequest, WritableStream } from "@tandem/mesh";
import { FileCacheItem, getAllUnsavedFiles, IFileCacheItemData, FILE_CACHE_COLLECTION_NAME } from "@tandem/sandbox";

export class LoadUnsavedFileCommand extends BaseTDProjectExtensionCommand {
  async execute() {
    this.tdProjectStore.unsavedFiles = await getAllUnsavedFiles(this.injector);
  }
}