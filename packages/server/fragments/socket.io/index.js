import uuid from 'uuid';
import Client from './client';
import { LOAD } from 'base/message-types';
import socketio from 'socket.io';
import { TypeNotifier } from 'common/notifiers';
import { ApplicationFragment } from 'common/fragment/types';

var id = uuid.v4();

export default ApplicationFragment.create({
  id: 'httpServer',
  factory: {
    create: create
  }
});

function create({ app }) {
  app.notifier.push(TypeNotifier.create(LOAD, load));

  function load() {
    var io = socketio(app.config.socketio.port);

    var clients = [];

    io.on('connection', function(con) {
      var client = new Client(con);
      clients.push(client);
      
      app.notifier.notify({
        type: 'remoteClient',
        client: client
      });
    });

  }
}
