import { AcceptBus, Response } from 'mesh';
import sift from 'sift';

export default {
  create(bus) {
    return AcceptBus.create(sift({ type: 'upsert' }), {
      execute(action) {
        return Response.create(async function(writable) {

          var chunk = await bus.execute({
            type           : 'find',
            query          : action.query,
            collectionName : action.collectionName,
          }).read();

          writable.write((await bus.execute({
            type           : !chunk.done ? 'update' : 'insert',
            data           : action.data,
            query          : action.query,
            collectionName : action.collectionName,
          }).read()).value);

          writable.close();
        });
      },
    }, bus);
  },
};
