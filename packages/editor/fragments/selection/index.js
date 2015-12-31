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

  function setFocus(message) {
    console.log('set focus!');
  }
}