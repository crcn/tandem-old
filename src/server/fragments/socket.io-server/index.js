import { ApplicationFragment } from 'common/application/fragments';
import { INITIALIZE } from 'common/application/events';
import { TypeCallbackBus } from 'common/busses';

export const fragment = ApplicationFragment.create('application/socket.io-server', create);

function create(app) {
  app.bus.push(TypeCallbackBus.create(INITIALIZE, initialize));

  function initialize() {
    
  }
}
