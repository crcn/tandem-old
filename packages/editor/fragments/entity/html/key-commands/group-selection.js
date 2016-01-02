
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
    KeyCommandFragment.create({
      id         : 'groupSelectionCommand',
      keyCommand : 'meta+g',
      notifier   : CallbackNotifier.create(groupSelection.bind(this, app))
    })
  ];
}

function groupSelection(app, message) {
  var selection = app.focus;

  // TODO - generalize this into group container
  var groupFactory = app.fragments.queryOne({
    id: 'elementEntity'
  });

  var group = groupFactory.factory.create({
    label: 'abba'
  });

  app.rootEntity.children.push(group);
  group.children.push(...selection);
}