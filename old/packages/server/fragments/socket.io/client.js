import { NotifierCollection } from 'common/notifiers';

class Client {
  constructor(connection) {
    this.connection = connection;
    this.notifier = NotifierCollection.create();
    connection.on('message', this.notifier.notify.bind(this.notifier));
  }

  notify(message) {
    this.connection.emit('message', message);
  }
}

export default Client;
