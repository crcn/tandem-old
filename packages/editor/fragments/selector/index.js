import {
  ApplicationFragment,
  KeyCommandFragment,
  FactoryFragment
} from 'editor/fragment/types';

import { toArray } from 'common/utils/object';
import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { SET_FOCUS, TOGGLE_FOCUS } from 'editor/message-types';
import { createSelectionQuery } from 'editor/fragment/queries';
import includes from 'lodash/collection/includes';

/**
 * selection handler whenever a user focuses on a given entity
 */

export default ApplicationFragment.create({
  id: 'appSelection',
  factory: {
    create: create
  }
});

function create({ app }) {

  app.notifier.push(TypeNotifier.create(SET_FOCUS, setFocus));
  app.notifier.push(TypeNotifier.create(TOGGLE_FOCUS, setFocus));

  app.fragments.push(
    KeyCommandFragment.create({
      id: 'removeSelection',
      keyCommand: 'backspace',
      notifier: CallbackNotifier.create(removeSelection)
    })
  );

  function removeSelection() {
    var selection = app.selection;

    app.setProperties({
      selection: []
    });

    if (selection) selection.deleteAll();

  }

  function setFocus(message) {

    var currentSelection = app.selection;

    var multiSelect = message.multiSelect;

    app.setProperties({
      selection: []
    });

    // no item? ignore
    if (!message.target) return;

    var fragment = app.fragments.queryOne(
      createSelectionQuery(message.target)
    );

    if (!fragment) {
      console.warn('entity type %s does not have an associated selection fragment, so it is not selectable', message.target.type);
      return;
    }

    var selection = fragment.factory.create({
      notifier: app.notifier
    });

    // make sure that the group types match
    currentSelection = multiSelect && currentSelection && selection.constructor === currentSelection.constructor ? currentSelection : selection;

    // remove the item from the selection if it currently exists.
    // This is basically a toggle feature

    toArray(message.target).forEach(function(target) {
      if (currentSelection.includes(target)) {

        // ensure that the message is "toggle", not "set"
        if (message.type === TOGGLE_FOCUS) {
          currentSelection.remove(target);
        }
      } else {
        currentSelection.push(target);
      }
    });

    requestAnimationFrame(() => {
      app.setProperties({
        selection: currentSelection
      })
    });
  }
}