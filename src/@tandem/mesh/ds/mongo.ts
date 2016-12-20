import { BaseDataStore } from "./base";
import { MongoClient, Db, Cursor, ObjectID } from "mongodb";
import { DuplexStream, IStreamableDispatcher, WritableStreamDefaultWriter } from "@tandem/mesh/core";
import { DSInsertRequest, DSFindRequest, DSFindAllRequest, DSRemoveRequest, DSMessage, DSUpdateRequest } from "./messages";

export class MongoDataStore extends  BaseDataStore {
  private _db: Db;

  constructor(private _url: string) {
    super();
  }

  protected connect() {
    return new Promise<any>((resolve, reject) => {
      MongoClient.connect(this._url, (err, db) => {
        if (err) return reject(err);
        this._db = db;
        resolve();
      });
    });
  }

  dsInsert(message: DSInsertRequest<any>) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      this._db.collection(message.collectionName).insert(message.data).then((result) => {
        (result.ops || []).forEach((op) => {
          writer.write(op);
        });
        writer.close();
      }).catch(writer.abort.bind(writer));
    });
  }

  dsRemove(message: DSRemoveRequest<any>) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();
      this._db.collection(message.collectionName).remove(message.query).then((result) => {
        (result.ops || []).forEach((op) => {
          writer.write(op);
        });
        writer.close();
      }).catch(writer.abort.bind(writer));
    });
  }

  dsUpdate(message: DSUpdateRequest<any, any>) {
    return new DuplexStream((input, output) => {
      this._db.collection(message.collectionName).update(message.query, { $set: message.data }).then((result) => {
        return this.dsFind(new DSFindRequest(message.collectionName, message.query, true)).readable.pipeTo(output);
      }).catch((e) => {
        output.getWriter().abort(e);
      });
    });
  }

  // TODO - bundle query messages together
  dsFind(message: DSFindRequest<any>) {
    return new DuplexStream((input, output) => {

      // ishy - fixes immediate problem. These needs to be part of a schema instead
      const q = JSON.parse(JSON.stringify(message.query));
      if (q._id) q._id = new ObjectID(String(q._id));
      this.pump(this._db.collection(message.collectionName).find(q), output.getWriter());
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