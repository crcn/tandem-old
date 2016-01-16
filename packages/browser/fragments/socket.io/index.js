import socketio from 'socket.io-client';
import { ApplicationFragment } from 'common/fragment/types';
import { clone } from 'common/utils/object';
import uuid from 'uuid';

var id = uuid.v4();

export default ApplicationFragment.create({
  id: 'socketio',
  factory: {
    create: create
  }
});

function create({ app }) {
  var io = socketio('http://127.0.0.1:8091');

  function send(message) {
    if (message.originId) return;

    // test for now - just get this working
    io.emit('message', {
      type: message.type,
      originId: id
    });
  }

  app.notifier.push({
    notify: send
  });

  io.on('message', function(message) {
    app.notifier.notify(message);
  });
}
