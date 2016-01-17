import { ApplicationFragment } from 'common/fragment/types';
import { KeyCommandFragment } from 'editor/fragment/types';
import { SET_ROOT_ENTITY, RootEntityMessage } from 'editor/message-types';
import { TypeNotifier } from 'common/notifiers';
import { deserialize as deserializeEntity } from 'common/entities/base';

export default ApplicationFragment.create({
  id: 'projectHandler',
  factory: {
    create: create
  }
});

function create({ app }) {
  app.notifier.push(TypeNotifier.create('openFile', openFile));
  var currentFileMessage;

  function openFile(message) {
    currentFileMessage = message;
    var content = message.content;
    var json = {};

    try {
      json = JSON.parse(content);
    } catch(e) {
      console.error('unable to open file %s', message.filePath);
      return;
    }

    var rootEntity = deserializeEntity(json, app.fragments);

    app.notifier.notify(RootEntityMessage.create(SET_ROOT_ENTITY, rootEntity));
  }

  app.fragments.push(KeyCommandFragment.create({
    id: 'saveFile',
    keyCommand: 'meta+s',
    notifier: {
      notify: function() {
        if (!currentFileMessage) return;
        app.notifier.notify({
          type: 'saveFile',
          filePath: currentFileMessage.filePath,
          content: JSON.stringify(app.rootEntity.serialize(), null, 2)
        })
      }
    }
  }));
}
