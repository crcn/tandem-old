import { MongoClient, Db, Cursor } from "mongodb";
import { DuplexStream, IStreamableDispatcher, WritableStreamDefaultWriter } from "@tandem/mesh/core";
import { BaseDataStore } from "./base";
import { DSInsertRequest, DSFindRequest, DSFindAllRequest, DSRemoveRequest, DSMessage, DSUpdateRequest } from "./messages";

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

  dsInsert(action: DSInsertRequest<any>) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      this._db.collection(action.collectionName).insert(action.data).then((result) => {
        (result.ops || []).forEach((op) => {
          writer.write(op);
        });
        writer.close();
      }).catch(writer.abort.bind(writer));
    });
  }

  dsRemove(action: DSRemoveRequest<any>) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      this._db.collection(action.collectionName).remove(action.query).then((result) => {
        (result.ops || []).forEach((op) => {
          writer.write(op);
        });
        writer.close();
      }).catch(writer.abort.bind(writer));
    });
  }

  dsUpdate(action: DSUpdateRequest<any, any>) {
    return new DuplexStream((input, output) => {
      this._db.collection(action.collectionName).update(action.query, { $set: action.data }).then((result) => {
        return this.dsFind(new DSFindRequest(action.collectionName, action.query, true)).readable.pipeTo(output);
      }).catch((e) => {
        output.getWriter().abort(e);
      });
    });
  }

  // TODO - bundle query actions together
  dsFind(action: DSFindRequest<any>) {
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