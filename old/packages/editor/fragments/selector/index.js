import {
  ApplicationFragment,
  KeyCommandFragment,
  FactoryFragment
} from 'editor/fragment/types';

import { toArray } from 'saffron-common/utils/object';
import includes from 'lodash/collection/includes';
import { TypeNotifier, CallbackNotifier } from 'saffron-common/notifiers';
import { SET_FOCUS, TOGGLE_FOCUS } from 'editor/message-types';
import { createSelectionQuery } from 'editor/fragment/queries';
//
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

  app.fragments.register(
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

  app.setProperties({
    selection: []
  });

  function setFocus(message) {

    var currentSelection = app.selection;

    var multiSelect = message.multiSelect;

    var targets = toArray(message.target);

    // no item? ignore
    if (!targets.length) return app.setProperties({
      selection: []
    });

    var fragment = app.fragments.queryOne(
      createSelectionQuery(targets)
    );

    if (!fragment) {
      console.warn('entity type %s does not have an associated selection fragment, so it is not selectable', targets[0].type);
      return;
    }

    var selection = fragment.factory.create({
      notifier: app.notifier
    });

    // make sure that the group types match
    currentSelection = multiSelect && currentSelection && selection.constructor === currentSelection.constructor ? currentSelection : selection;


    // remove the item from the selection if it currently exists.
    // This is a toggle feature.
    targets.forEach(function(target) {
      if (currentSelection.includes(target)) {

        // ensure that the message is "toggle", not "set"
        if (message.type === TOGGLE_FOCUS) {
          currentSelection.remove(target);
        }
      } else {
        currentSelection.push(target);

        _toggleExpansion(target);
      }
    });

    // expands the layer (left pane) when selected
    function _toggleExpansion(target) {
      var p = target.parent;
      while(p) {
        p.setProperties({ layerExpanded: true });
        p = p.parent;
      }
    }

    // need to give time for the current selection
    // to be displayed on screen (could be new)
    requestAnimationFrame(() => {
      app.setProperties({
        selection: currentSelection
      });
    });

    // one notifier here - primarily setup to purge memos
    app.notifier.push({
      notify: function(message) {
        if (app.selection.notify) {
          app.selection.notify(message);
        }
      }
    })
  }
}
