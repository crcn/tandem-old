
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

export function create({ app }) {

  return [

    // generic
    // TODO - move this to its own fragment
    KeyCommandFragment.create({
      id         : 'boldCommand',
      keyCommand : 'backspace',
      notifier   : CallbackNotifier.create(function() {
        if (!app.focus || !app.focus.componentType || !app.focus.parent) return;

        // FIXME: leaky here. should be able to remove entity
        // without it being unfocused
        var focus = app.focus;
        var focusIndex = focus.parent.children.indexOf(focus);

        var nextSibling = focusIndex ? focus.parent.children[focusIndex - 1] : focus.parent.children[focusIndex + 1];

        app.notifier.notify(SetFocusMessage.create(nextSibling));

        // remove the child deleted
        focus.parent.children.remove(focus);
      })
    }),

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
    })
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