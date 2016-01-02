
// TODO - import this from "fragments/key-keycommander/types" or similar
import {
  KeyCommandFragment
} from 'editor/fragment/types';

import {
  CallbackNotifier
} from 'common/notifiers';

import {
  SetFocusMessage
} from 'editor/message-types';

import { create as createGroupSelectionFragment } from './group-selection';

export function create({ app }) {

  return [
    // text
    KeyCommandFragment.create({
      id         : 'boldCommand',
      keyCommand : 'command+b',
      notifier   : createStyleToggler(app, 'fontWeight', 'bold', 'normal')
    }),
    KeyCommandFragment.create({
      id         : 'italicCommand',
      keyCommand : 'command+i',
      notifier   : createStyleToggler(app, 'fontStyle', 'italic', 'normal')
    }),
    KeyCommandFragment.create({
      id         : 'underlineCommand',
      keyCommand : 'command+u',
      notifier   : createStyleToggler(app, 'textDecoration', 'underline', 'none')
    }),
    ...createGroupSelectionFragment({ app })
  ];
}

function createStyleToggler(app, name, onValue, offValue) {
  return CallbackNotifier.create(function(message) {
    if (!app.focus || app.focus.componentType !== 'text') return;
    app.focus.setStyle({
      [name]: app.focus.getStyle()[name] === onValue ? offValue : onValue
    });
  })
}