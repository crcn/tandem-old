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
    }),
    ...createNudgeFragments(app)
  ]
}


function createNudgeFragments(app) {
  return [
    KeyCommandFragment.create({
      id         : 'upKeyCommand',
      keyCommand : 'up',
      notifier   : app.notifier
    }),

    KeyCommandFragment.create({
      id         : 'downKeyCommand',
      keyCommand : 'down',
      notifier   : app.notifier
    }),

    KeyCommandFragment.create({
      id         : 'rightKeyCommand',
      keyCommand : 'right',
      notifier   : app.notifier
    }),

    KeyCommandFragment.create({
      id         : 'leftKeyCommand',
      keyCommand : 'left',
      notifier   : app.notifier
    })
  ];
}
