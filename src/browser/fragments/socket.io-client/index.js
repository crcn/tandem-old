import { LOAD } from 'common/application/events';
import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus, FilterBus, CallbackBus } from 'common/busses';
import createSocketioClient from 'socket.io-client';
import sift from 'sift';

export const fragment = ApplicationFragment.create('socket.io-client', create);

function create(app) {
  var port = app.config.socketio.port;
  var logger = app.logger.createChild({ prefix: 'socket.io ' });
  var client;

  app.bus.push(TypeCallbackBus.create(LOAD, onLoad));
  app.bus.push(FilterBus.create(sift({ public: true, remote: { $ne: true } }), CallbackBus.create(onPublicEvent)));

  function onLoad(event) {
    logger.info('starting socket.io client on port %d', port);
    client = createSocketioClient(`//${window.location.hostname}:${port}`);
    client.on('connect', function() {
      logger.verbose('connected to server');
    });
  }

  function onPublicEvent(event) {
    event.remote = true;
    client.send(event);
  }
}
