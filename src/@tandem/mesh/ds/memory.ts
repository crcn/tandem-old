import * as sift from "sift";
import { BaseDataStore } from "./base";
import { ReadableStream } from "@tandem/mesh/core";
import { DSFind, DSFindAll, DSInsert, DSRemove, DSUpdate, DSMessage } from "./messages";

export class MemoryDataStore extends BaseDataStore {

  private _data: {
    [Identifier: string]: any[]
  };

  constructor() {
    super();
    this._data = {};
  }

  dsFind({ type, query }: DSFind<any>) {
    return this.getCollection(type).find(sift(query) as any);
  }

  dsInsert({ type, data }: DSInsert<any>) {
    this.getCollection(type).push(JSON.parse(JSON.stringify(data)));
  }

  dsRemove({ type, query }: DSRemove<any>) {
    const collection = this.getCollection(type);
    const filter = sift(query) as any;
    for (let i = collection.length; i--;) {
      const item = collection[i];
      if (filter(item)) {
        collection.splice(i, 1);
      }
    }
  }

  dsUpdate({ type, query, data }: DSUpdate<any, any>) {
    const collection = this.getCollection(type);
    const filter = sift(query) as any;
    for (let i = collection.length; i--;) {
      const item = collection[i];
      if (filter(item)) {
        collection.splice(i, 1, JSON.parse(JSON.stringify(data)));
      }
    }
  }

  private getCollection(type: string) {
    return this._data[type] || (this._data[type] = []);
  }
}