import { IMessage } from "@tandem/mesh";

export class UpdateFileCacheRequest implements IMessage {
  static readonly UPDATE_FILE_CACHE = "updateFileCache";
  readonly type = UpdateFileCacheRequest.UPDATE_FILE_CACHE;
  constructor(readonly uri: string, readonly content: string) {
    
  }
}