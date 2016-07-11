import { ApplicationFragment } from 'common/application/fragments';
import { INITIALIZE, LOAD } from 'common/application/events';
import { TypeCallbackBus, FilterBus, CallbackBus } from 'common/busses';
import sift from 'sift';
import createServer from 'socket.io';

export const fragment = ApplicationFragment.create('application/socket.io-server', create);

function create(app) {
  app.bus.push(TypeCallbackBus.create(LOAD, load));
  app.bus.push(TypeCallbackBus.create(INITIALIZE, initialize));
  app.bus.push(FilterBus.create(sift({ public: true }), CallbackBus.create(executeRemoteEvent)));

  const port = app.config.socketio.port;

  function load(event) {
    app.logger.verbose('checking for existing socket.io instances');
  }

  function initialize() {
    app.logger.info('starting socket.io server on port %d', port);
    var server = createServer();
    server.listen(port);
  }

  function executeRemoteEvent(event) {
    app.logger.verbose('exec public event %s', event);
  }
}
