import { MongoClient, Db, Cursor } from "mongodb";
import { DuplexStream, IStreamableDispatcher, WritableStreamDefaultWriter } from "@tandem/mesh/core";
import { BaseDataStore } from "./base";
import { DSInsert, DSFind, DSFindAll, DSRemove, DSMessage, DSUpdate } from "./messages";

export class MongoDataStore extends  BaseDataStore {
  private _db: Db;

  constructor(private _url: string) {
    super();
  }

  protected connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this._url, (err, db) => {
        if (err) return reject(err);
        this._db = db;
        resolve();
      });
    });
  }

  dsInsert(action: DSInsert<any>) {
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

  dsRemove(action: DSRemove<any>) {
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

  dsUpdate(action: DSUpdate<any, any>) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      this._db.collection(action.collectionName).update(action.query, { $set: action.data }, function(err, result) {
        if (err) return writer.abort(err);
        writer.close();
      });
    });
  }

  // TODO - bundle query actions together
  dsFind(action: DSFind<any>) {
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