import {
  ApplicationFragment,
  KeyCommandFragment
} from 'editor/fragment/types';

import { PasteMessage } from 'editor/message-types';
import { CallbackNotifier } from 'common/notifiers';

export default ApplicationFragment.create({
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

  app.fragments.push(
    KeyCommandFragment.create({
      id         : 'copyCommand',
      keyCommand : 'command+c',
      notifier   : CallbackNotifier.create(copy)
    }),

    KeyCommandFragment.create({
      id         : 'pasteCommand',
      keyCommand : 'command+v',
      notifier   : CallbackNotifier.create(paste)
    })
  )
}
