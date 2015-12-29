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

  function _clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  var copiedData;

  function copy() {
    copiedData = _clone(app.focus.serialize());
  }

  function paste() {
    // TODO - use actual clipboard data
    if (copiedData != void 0) {
      app.notifier.notify(PasteMessage.create(_clone(copiedData)));
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
