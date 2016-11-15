import { MongoClient, Db, Cursor } from "mongodb";
import { DuplexStream, IStreamableDispatcher, WritableStreamDefaultWriter } from "@tandem/mesh";

import {
  Action,
  ProxyBus,
  DSFindAction,
  DSUpdateAction,
  DSInsertAction,
  DSRemoveAction,
  DSFindAllAction,
} from "@tandem/common";

export class MongoDS implements IStreamableDispatcher<any> {

  private _proxy: ProxyBus;
  private _db: Db;

  constructor(url: string) {

    this._proxy = new ProxyBus({
      dispatch: (action: Action) => {
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


  dispatch(action: Action) {
    return this._proxy.dispatch(action);
  }

  [DSInsertAction.DS_INSERT](action: DSInsertAction<any>) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      this._db.collection(action.collectionName).insert(action.data).then((result) => {
        result.ops.forEach((op) => {
          writer.write(op);
        });
        writer.close();
      });
    });
  }

  [DSRemoveAction.DS_REMOVE](action: DSRemoveAction<any>) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      this._db.collection(action.collectionName).remove(action.query).then((items) => {
        items.ops.forEach((op) => {
          writer.write(op);
        });
        writer.close();
      });
    });
  }

  [DSUpdateAction.DS_UPDATE](action: DSUpdateAction<any, any>) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      this._db.collection(action.collectionName).update(action.query, { $set: action.data }, function(err, result) {
        if (err) return writer.abort(err);
        writer.close();
      });
    });
  }

  // TODO - bundle query actions together
  [DSFindAction.DS_FIND](action: DSFindAction<any>) {
    return new DuplexStream((input, output) => {
      this.pump(this._db.collection(action.collectionName).find(action.query), output.getWriter());
    });
  }

  private async pump(cursor: Cursor, writer: WritableStreamDefaultWriter<any>) {
    if (!(await cursor.hasNext())) {
      return writer.close();
    }
    writer.write(await cursor.next());
    await this.pump(cursor, writer);
  }
}