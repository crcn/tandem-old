import {
  ApplicationPlugin,
  KeyCommandPlugin
} from 'editor/plugin/types';

import { CallbackNotifier } from 'common/notifiers';

export default ApplicationPlugin.create({
  id: 'clipboard',
  factory: {
    create: create
  }
});

function create({ app }) {

  function copy() {
    console.log('copy');
  }

  function paste() {
    console.log('paste');
  }

  app.plugins.push(
    KeyCommandPlugin.create({
      id         : 'copyCommand',
      keyCommand : 'command+c',
      notifier   : CallbackNotifier.create(copy)
    }),

    KeyCommandPlugin.create({
      id         : 'pasteCommand',
      keyCommand : 'command+p',
      notifier   : CallbackNotifier.create(paste)
    })
  )
}
