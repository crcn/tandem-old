import {
  ApplicationFragment,
  KeyCommandFragment,
  FactoryFragment
} from 'editor/fragment/types';

import {
  SET_FOCUS
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

  // TODO - add shift key command handler here

  function setFocus(message) {
    console.log(message.multiSelect);

    var selection = app.focus;


    app.setProperties({
      focus: void 0
    });

    // no item? ignore
    if (!message.target) return;

    //var fragment = app.fragments.queryOne(
    //  createSelectionQuery(message.target.type)
    //);
    //
    //var selection = fragment.factory.create();

    //selection.push(message.target);

    requestAnimationFrame(() => {
      app.setProperties({
        focus: message.target
      })
    });
  }
}