import { ApplicationFragment } from 'common/application/fragments';

export const fragment = ApplicationFragment.create({
  ns: 'application/socket.io-client',
  initialize: createSocketioClient,
});

function createSocketioClient(app) {
  var port = app.config.socketio.port;

  app.logger.info('starting socket.io client on port %d', port);
}
