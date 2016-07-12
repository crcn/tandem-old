import { ApplicationFragment } from 'common/application/fragments';
import { INITIALIZE } from 'common/application/events';
import { TypeCallbackBus } from 'common/mesh';


export const fragment = ApplicationFragment.create({
  ns: 'application/fileHandler',
  initialize: create,
});

function create(app) {
  app.busses.push(TypeCallbackBus.create(INITIALIZE, initialize));
  const logger = app.logger.createChild({ prefix: 'file handler' });

  async function initialize(event) {
    const openFiles = await app.bus.execute({
      type: 'getOpenFiles',
      remote: true,
    }).readAll();

    console.log(openFiles);
  }
}
