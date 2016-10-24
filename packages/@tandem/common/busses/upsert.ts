import * as sift from "sift";
import { AcceptBus, Response } from "mesh";

export const UpsertBus = {
  create(bus) {

    return AcceptBus.create(sift({ type: "upsert" }), {
      execute(action) {
        return Response.create(async function(writable) {

          const chunk = await bus.execute({
            type           : "find",
            query          : action.query,
            collectionName : action.collectionName,
          }).read();

          writable.write((await bus.execute({
            type           : !chunk.done ? "update" : "insert",
            data           : action.data,
            query          : action.query,
            collectionName : action.collectionName,
          }).read()).value);

          writable.close();
        });
      }
    }, bus);
  }
};
