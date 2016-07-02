import socketio from 'socket.io-client';
import { ApplicationFragment } from 'common/fragment/types';
import { TypeNotifier } from 'common/notifiers';
import { LOAD } from 'base/message-types';
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
  app.notifier.push(TypeNotifier.create(LOAD, load.bind(this, app)));
}

function load(app) {

  function send(message) {
    if (message.originId) return;
    var c = {};

    // only serialize pojo objects
    for (var key in message) {
      var value = message[key];
      if (value && typeof value === 'object') {
        if (value.constructor !== Object) {
          continue;
        }
        value = clone(value);
      }

      c[key] = value;
    }

    io.emit('message', c);
  }

  var io = app.socketio = socketio('http://127.0.0.1:8091');

  app.notifier.push({
    notify: send
  });

  io.on('message', function(message) {
    app.notifier.notify(message);
  });
}
