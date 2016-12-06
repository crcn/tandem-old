import { IMessage, IStreamableDispatcher, readAllChunks, readOneChunk } from "@tandem/mesh/core";
import sift = require("sift");

export class DSMessage implements IMessage {
  readonly timestamp: number = Date.now();
  constructor(readonly type: string, readonly collectionName: string) {
  }
}

export class DSInsertRequest<T> extends DSMessage {
  static readonly DS_INSERT = "dsInsert";
  constructor(collectionName: string, readonly data: T) {
    super(DSInsertRequest.DS_INSERT, collectionName);
  }
  static async dispatch(collectionName: string, data: any, dispatcher: IStreamableDispatcher<any>) {
    return await readAllChunks(dispatcher.dispatch(new DSInsertRequest(collectionName, data)));
  }
}

export class DSUpdateRequest<T, U> extends DSMessage {
  static readonly DS_UPDATE = "dsUpdate";
  constructor(collectionName: string, readonly data: T, readonly query: U) {
    super(DSUpdateRequest.DS_UPDATE, collectionName);
  }

  static async dispatch(collectionName: string, data: any, query: any, dispatcher: IStreamableDispatcher<any>): Promise<Array<any>> {
    return await readAllChunks(dispatcher.dispatch(new DSUpdateRequest(collectionName, data, query)));
  }
}

export class DSFindRequest<T> extends DSMessage {
  static readonly DS_FIND   = "dsFind";
  constructor(collectionName: string, readonly query: T, readonly multi: boolean = false) {
    super(DSFindRequest.DS_FIND, collectionName);
  }
  static createFilter(collectionName: string) {
    return sift({ collectionName: collectionName });
  }
  static async findOne(collectionName: string, query: Object, dispatcher: IStreamableDispatcher<any>): Promise<any> {
    return (await readOneChunk<any>(dispatcher.dispatch(new DSFindRequest(collectionName, query, true)))).value;
  }
  static async findMulti(collectionName: string, query: Object, dispatcher: IStreamableDispatcher<any>): Promise<any[]> {
    return await readAllChunks(dispatcher.dispatch(new DSFindRequest(collectionName, query, true)));
  }
}

export class DSFindAllRequest extends DSFindRequest<any> {
  constructor(collectionName: string) {
    super(collectionName, {}, true);
  }
}

export class DSRemoveRequest<T> extends DSMessage {
  static readonly DS_REMOVE   = "dsRemove";
  constructor(collectionName: string, readonly query: T) {
    super(DSRemoveRequest.DS_REMOVE, collectionName);
  }
}