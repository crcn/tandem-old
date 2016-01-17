import fs from 'fs';
import { ApplicationFragment } from 'common/fragment/types';
import { TypeNotifier, NotifierCollection } from 'common/notifiers';

export default ApplicationFragment.create({
  id: 'fileHandler',
  factory: {
    create: create
  }
});

function create({ app }) {

  var clientsNotifier = NotifierCollection.create();

  app.notifier.push(TypeNotifier.create('openFile', openFile.bind(this, clientsNotifier)));
  app.notifier.push(TypeNotifier.create('remoteClient', handleRemoteClient));

  var currentFileMessage;

  function openFile(notifier, message) {
    if (!message) return;
    notifier.notify(currentFileMessage = Object.assign({}, message, {
      content: fs.readFileSync(message.filePath, 'utf8')
    }))
  }

  function handleRemoteClient({ client }) {
    clientsNotifier.push(client);
    openFile(client, currentFileMessage);
  }
}
