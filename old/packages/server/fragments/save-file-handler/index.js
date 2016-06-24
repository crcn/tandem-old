import fs from 'fs';
import path from 'path';
import { ADDED_FILE } from 'editor/message-types';
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
    client.notifier.push(TypeNotifier.create('addFile', addFile));

    function saveFile(message) {
      fs.writeFileSync(message.filePath, decodeBase64(message.content));

      var basename = path.basename(message.filePath);
    }

    function addFile(message) {
      fs.writeFileSync(message.fileName, decodeBase64(message.content));

      var basename = path.basename(message.filePath);

      client.notify({
        type: ADDED_FILE,
        fileName: message.fileName,
        url: 'http://' + app.config.http.domain + ':' + app.config.http.port + '/' + message.fileName
      });
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
