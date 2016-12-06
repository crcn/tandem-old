import sift = require("sift");
import { DuplexStream, IBus, readOneChunk } from "@tandem/mesh";

export class UpsertBus implements IBus<any> {
  constructor(private _child: IBus<any>) {

  }
  dispatch(action) {
    return new DuplexStream(async (input, output) => {
      const writer = output.getWriter();

      const { value, done } = await readOneChunk(this._child.dispatch({
        type           : "find",
        query          : action.query,
        collectionName : action.collectionName,
      }));

      writer.write((await readOneChunk(this._child.dispatch({
        type           : !done ? "update" : "insert",
        data           : action.data,
        query          : action.query,
        collectionName : action.collectionName,
      }))).value);

      writer.close();
    });
  }
}
