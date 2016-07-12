import { LOAD } from 'common/application/events';
import { ApplicationFragment } from 'common/application/fragments';
import { AcceptBus, WrapBus, AttachDefaultsBus } from 'mesh';
import RemoteBus from 'mesh-remote-bus';
import { TypeCallbackBus } from 'common/mesh';
import createSocketioClient from 'socket.io-client';
import sift from 'sift';

export const fragment = ApplicationFragment.create({
  ns: 'application/socketIoClient',
  initialize: create
});

function create(app) {
  var port = app.config.socketio.port;
  var logger = app.logger.createChild({ prefix: 'socket.io: ' });
  var client;
  var remoteBus;

  app.busses.push(TypeCallbackBus.create(LOAD, load));

  function load(event) {
    return new Promise(function(resolve) {
      logger.info('starting socket.io client on port %d', port);
      client = createSocketioClient(`//${window.location.hostname}:${port}`);

      remoteBus = RemoteBus.create({
        addListener: client.on.bind(client, 'message'),
        send: client.emit.bind(client, 'message')
      }, AttachDefaultsBus.create({ remote: true }, app.bus));

      remoteBus = AcceptBus.create(sift({ public: true, remote: { $ne: true } }), remoteBus);

      app.busses.push(remoteBus);

      client.on('connect', function(connection) {
        logger.verbose('connected to server');
        resolve();
      });
    });
  }
}
