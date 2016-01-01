import {
  CallbackNotifier
} from 'common/notifiers';

import {
  KeyCommandFragment
} from 'editor/fragment/types';

export function create({ app, preview }) {
  return [
    KeyCommandFragment.create({
      id         : 'zoomInKeyCommand',
      keyCommand : 'meta+=',
      notifier   : CallbackNotifier.create(
        preview.zoomIn.bind(preview)
      )
    }),
    KeyCommandFragment.create({
      id         : 'zoomOutKeyCommand',
      keyCommand : 'meta+-',
      notifier   : CallbackNotifier.create(
        preview.zoomOut.bind(preview)
      )
    })
  ]
}