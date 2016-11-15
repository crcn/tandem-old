import { IMessage, IStreamableDispatcher, readAllChunks, readOneChunk } from "@tandem/mesh/core";
import * as sift from "sift";

// @defineProtectedAction()
export class DSMessage implements IMessage {
  readonly timestamp: number = Date.now();
  constructor(readonly type: string, readonly collectionName: string) {
  }
}

export class DSInsert<T> extends DSMessage {
  static readonly DS_INSERT = "dsInsert";
  constructor(collectionName: string, readonly data: T) {
    super(DSInsert.DS_INSERT, collectionName);
  }
  static async dispatch(collectionName: string, data: any, dispatcher: IStreamableDispatcher<any>) {
    return await readAllChunks(dispatcher.dispatch(new DSInsert(collectionName, data)));
  }
}

export class DSUpdate<T, U> extends DSMessage {
  static readonly DS_UPDATE = "dsUpdate";
  constructor(collectionName: string, readonly data: T, readonly query: U) {
    super(DSUpdate.DS_UPDATE, collectionName);
  }

  static async dispatch(collectionName: string, data: any, query: any, dispatcher: IStreamableDispatcher<any>): Promise<Array<any>> {
    return await readAllChunks(dispatcher.dispatch(new DSUpdate(collectionName, data, query)));
  }
}

export class DSFind<T> extends DSMessage {
  static readonly DS_FIND   = "dsFind";
  constructor(collectionName: string, readonly query: T, readonly multi: boolean = false) {
    super(DSFind.DS_FIND, collectionName);
  }
  static createFilter(collectionName: string) {
    return sift({ collectionName: collectionName });
  }
  static async findOne(collectionName: string, query: Object, dispatcher: IStreamableDispatcher<any>): Promise<any> {
    return (await readOneChunk<any>(dispatcher.dispatch(new DSFind(collectionName, query, true)))).value;
  }
  static async findMulti(collectionName: string, query: Object, dispatcher: IStreamableDispatcher<any>): Promise<any[]> {
    return await readAllChunks(dispatcher.dispatch(new DSFind(collectionName, query, true)));
  }
}

export class DSFindAll extends DSFind<any> {
  constructor(collectionName: string) {
    super(collectionName, {}, true);
  }
}

export class DSRemove<T> extends DSMessage {
  static readonly DS_REMOVE   = "dsRemove";
  constructor(collectionName: string, readonly query: T) {
    super(DSRemove.DS_REMOVE, collectionName);
  }
}