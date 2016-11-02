import { MongoClient, Db, Cursor } from "mongodb";
import { Response } from "mesh";

import {
  IActor,
  Action,
  ProxyBus,
  DSFindAction,
  DSUpdateAction,
  DSInsertAction,
  DSRemoveAction,
  DSFindAllAction,
} from "@tandem/common";

export class MongoDS implements IActor {

  private _proxy: ProxyBus;
  private _db: Db;

  constructor(url: string) {

    this._proxy = new ProxyBus({
      execute: (action: Action) => {
        if (this[action.type]) {
          return this[action.type](action);
        }
      }
    });

    this._proxy.pause();

    MongoClient.connect(url, (err, db) => {
      if (err) throw err;
      this._db = db;
      this._proxy.resume();
    });
  }


  execute(action: Action) {
    return this._proxy.execute(action);
  }

  [DSInsertAction.DS_INSERT](action: DSInsertAction<any>) {
    return new Response((writable) => {
      this._db.collection(action.collectionName).insert(action.data).then((result) => {
        result.ops.forEach((op) => {
          writable.write(op);
        });
        writable.close();
      });
    });
  }

  [DSRemoveAction.DS_REMOVE](action: DSRemoveAction<any>) {
    return new Response((writable) => {
      this._db.collection(action.collectionName).remove(action.query).then((items) => {
        items.ops.forEach((op) => {
          writable.write(op);
        });
        writable.close();
      });
    });
  }

  [DSUpdateAction.DS_UPDATE](action: DSUpdateAction<any, any>) {
    return new Response((writable) => {
      this._db.collection(action.collectionName).update(action.query, { $set: action.data }, function(err, result) {
        if (err) return writable.abort(err);
        writable.close();
      });
    });
  }

  // TODO - bundle query actions together
  [DSFindAction.DS_FIND](action: DSFindAction<any>) {
    return new Response((writable) => {
      this.pump(this._db.collection(action.collectionName).find(action.query), writable);
    });
  }

  private async pump(cursor: Cursor, writable: any) {
    if (!(await cursor.hasNext())) {
      return writable.close();
    }
    writable.write(await cursor.next());
    await this.pump(cursor, writable);
  }
}