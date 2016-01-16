import { NotifierCollection } from 'common/notifiers';

class Client {
  constructor(connection) {
    this.notifier = NotifierCollection.create();
    connection.on('message', this.notifier.notify.bind(this.notifier));
  }
}

export default Client;
