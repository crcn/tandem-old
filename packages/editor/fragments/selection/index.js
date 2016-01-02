import {
  ApplicationFragment,
  KeyCommandFragment,
  FactoryFragment
} from 'editor/fragment/types';

import {
  SET_FOCUS,
  TOGGLE_FOCUS
} from 'editor/message-types';

import {
  TypeNotifier
} from 'common/notifiers';

import {
  createSelectionQuery
} from 'editor/fragment/queries';

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
  console.log('create selection');

  app.notifier.push(TypeNotifier.create(SET_FOCUS, setFocus));
  app.notifier.push(TypeNotifier.create(TOGGLE_FOCUS, setFocus));

  // TODO - add shift key command handler here

  function setFocus(message) {

    var currentSelection = app.focus;

    var multiSelect = message.multiSelect;

    app.setProperties({
      focus: void 0
    });

    // no item? ignore
    if (!message.target) return;

    var fragment = app.fragments.queryOne(
      createSelectionQuery(message.target.type)
    );

    if (!fragment) {
      console.warn('entity type %s does not have an associated selection fragment, so it is not selectable', message.target.type);
      return;
    }

    var selection = fragment.factory.create();

    // make sure that the group types match
    currentSelection = multiSelect && currentSelection && selection.constructor === currentSelection.constructor ? currentSelection : selection;

    // remove the item from the selection if it currently exists.
    // This is basically a toggle feature

    if (currentSelection.includes(message.target)) {

      // ensure that the message is "toggle", not "set"
      if (message.type === TOGGLE_FOCUS) {
        currentSelection.remove(message.target);
      }
    } else {
      currentSelection.push(message.target);
    }


    requestAnimationFrame(() => {
      app.setProperties({
        focus: currentSelection
      })
    });
  }
}