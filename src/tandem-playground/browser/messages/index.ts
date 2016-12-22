import { IMessage, readOneChunk, IStreamableDispatcher } from "@tandem/mesh";
import { FileCacheItem, IFileCacheItemData } from "@tandem/sandbox";

export class UpdateFileCacheRequest implements IMessage {
  static readonly UPDATE_FILE_CACHE = "updateFileCache";
  readonly type = UpdateFileCacheRequest.UPDATE_FILE_CACHE;
  constructor(readonly uri: string, readonly content: string, readonly updatedAt: number = Date.now()) {
    
  }
  static async dispatch(uri: string, content: string, bus: IStreamableDispatcher<any>): Promise<IFileCacheItemData> {
    return (await readOneChunk(bus.dispatch(new UpdateFileCacheRequest(uri, content)))).value;
  }
}

export class FileCacheItemUpdatedMessage implements IMessage {
  static readonly FILE_CACHE_ITEM_UPDATED = "fileCacheItemUpdated";
  readonly type = FileCacheItemUpdatedMessage.FILE_CACHE_ITEM_UPDATED;
  constructor(readonly item: FileCacheItem) {
    
  }
}