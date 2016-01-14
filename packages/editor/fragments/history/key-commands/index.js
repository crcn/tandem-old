import {
  CallbackNotifier
} from 'common/notifiers';

import {
  KeyCommandFragment
} from 'editor/fragment/types';

export function create({ history }) {


  return [
    KeyCommandFragment.create({
      id         : 'undoCommand',
      keyCommand : 'command+z',
      notifier   : CallbackNotifier.create(history.shift.bind(this, -1))
    }),
    KeyCommandFragment.create({
      id         : 'redoCommand',
      keyCommand : 'command+y',
      notifier   : CallbackNotifier.create(history.shift.bind(this, 1))
    })
  ];
}