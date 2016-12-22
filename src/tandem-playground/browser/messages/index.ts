import { IMessage } from "@tandem/mesh";
import { FileCacheItem } from "@tandem/sandbox";

export class UpdateFileCacheRequest implements IMessage {
  static readonly UPDATE_FILE_CACHE = "updateFileCache";
  readonly type = UpdateFileCacheRequest.UPDATE_FILE_CACHE;
  constructor(readonly uri: string, readonly content: string) {
    
  }
}

export class FileCacheItemUpdatedMessage implements IMessage {
  static readonly FILE_CACHE_ITEM_UPDATED = "fileCacheItemUpdated";
  readonly type = FileCacheItemUpdatedMessage.FILE_CACHE_ITEM_UPDATED;
  constructor(readonly item: FileCacheItem) {
    
  }
}