import {
  ApplicationPlugin,
  KeyCommandPlugin
} from 'editor/plugin/types';

import { PasteMessage } from 'editor/message-types';
import { CallbackNotifier } from 'common/notifiers';

export default ApplicationPlugin.create({
  id: 'clipboard',
  factory: {
    create: create
  }
});

function create({ app }) {

  var copiedData;

  function copy() {
    copiedData = app.focus.serialize();
  }

  function paste() {
    // TODO - use actual clipboard data
    if (copiedData != void 0) {
      app.notifier.notify(PasteMessage.create(copiedData));
    }
  }

  app.plugins.push(
    KeyCommandPlugin.create({
      id         : 'copyCommand',
      keyCommand : 'command+c',
      notifier   : CallbackNotifier.create(copy)
    }),

    KeyCommandPlugin.create({
      id         : 'pasteCommand',
      keyCommand : 'command+v',
      notifier   : CallbackNotifier.create(paste)
    })
  )
}
