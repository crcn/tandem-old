
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

var _i = 0;

function groupSelection(app, message) {

  var highestParent = app.selection.reduce(function(a, b) {
    return a.parent.includes(b) ? a : b;
  }).parent;

  var selection = app.selection.deleteAll();

  // TODO - generalize this into group container
  var groupFactory = app.fragments.queryOne({
    id: 'elementEntity'
  });

  var group = groupFactory.factory.create({
    componentType : 'element',
    tagName: 'div',
    attributes: {
      class: 'group' + (++_i),
      style: {
        position: 'absolute',
        display: 'block'
      }
    }
  });

  highestParent.children.push(group);
  group.children.push(...selection);

  app.notifier.notify(SetFocusMessage.create([group]));
}