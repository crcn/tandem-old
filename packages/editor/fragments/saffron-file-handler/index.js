import { ApplicationFragment } from 'common/fragment/types';
import { KeyCommandFragment } from 'editor/fragment/types';
import { SET_ROOT_ENTITY, CLEAR_HISTORY, RootEntityMessage } from 'editor/message-types';
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
    var rootEntity;

    var div = app.fragments.queryOne({
      id: 'elementEntity'
    });

    try {
      rootEntity = deserializeEntity(JSON.parse(message.content), app.fragments);
    } catch(e) {
      console.error('unable to open file %s', message.filePath);
      rootEntity = div.factory.create({
        componentType : 'element',
        tagName       : 'div',
        layerExpanded : true
      });
    }


    app.notifier.notify(RootEntityMessage.create(SET_ROOT_ENTITY, rootEntity));
    app.notifier.notify({ type: CLEAR_HISTORY });
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
