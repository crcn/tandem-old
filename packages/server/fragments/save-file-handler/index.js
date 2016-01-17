import fs from 'fs';
import path from 'path';
import { ApplicationFragment } from 'common/fragment/types';
import { TypeNotifier, NotifierCollection } from 'common/notifiers';

export default ApplicationFragment.create({
  id: 'fileHandler',
  factory: {
    create: create
  }
});

function create({ app }) {

  app.notifier.push(TypeNotifier.create('remoteClient', handleRemoteClient));

  function handleRemoteClient({ client }) {
    client.notifier.push(TypeNotifier.create('saveFile', saveFile));

    function saveFile(message) {
      fs.writeFileSync(message.filePath, decodeBase64(message.content));
    }
  }
}

function decodeBase64(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
        return dataString;
    }

    return new Buffer(matches[2], 'base64');
}
