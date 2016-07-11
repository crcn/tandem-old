import { ApplicationFragment } from 'common/application/fragments';
import { INITIALIZE, LOAD } from 'common/application/events';
import { TypeCallbackBus, FilterBus, CallbackBus } from 'common/busses';
import sift from 'sift';
import createServer from 'socket.io';

export const fragment = ApplicationFragment.create('application/socket.io-server', create);

function create(app) {
  app.bus.push(TypeCallbackBus.create(LOAD, load));
  app.bus.push(TypeCallbackBus.create(INITIALIZE, initialize));
  app.bus.push(
    FilterBus.create(
      sift({ public: true, remote: { $ne: true } }),
      CallbackBus.create(executeRemoteEvent)
    )
  );

  const port   = app.config.socketio.port;
  const logger = app.logger.createChild({ prefix: 'socket.io ' });

  function load(event) {
    logger.verbose('checking for existing socket.io instances');
  }

  function initialize() {
    logger.info('server on port %d', port);
    var server = createServer();
    server.on('connection', function(connection) {
      connection.on('message', app.bus.execute.bind(app.bus));
    })
    server.listen(port);
  }

  function executeRemoteEvent(event) {
    app.logger.verbose('exec public event %s', event);
  }
}
