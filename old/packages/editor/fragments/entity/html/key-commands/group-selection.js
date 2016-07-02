
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

  // find the highest selection
  var targetSelection = app.selection.reduce(function(a, b) {
    return a.parent.includes(b) ? a : b;
  });

  // TODO - generalize this into group container
  var groupFactory = app.fragments.queryOne({
    id: 'elementEntity'
  });

  var group = groupFactory.factory.create({
    componentType : 'element',
    tagName: 'div',
    attributes: {
      id: 'group' + (++_i),
      style: {
        position: 'absolute',
        display: 'block'
      }
    }
  });

  // with the highest selection, insert the new group immediately
  // after the target selection
  targetSelection.parent.children.splice(
    targetSelection.parent.children.indexOf(targetSelection),
    0,
    group
  );

  // then remove the entire selection
  var selection = app.selection.deleteAll();

  // take that removed selection & add to the group
  group.children.push(...selection);

  // then re-select the group
  app.notifier.notify(SetFocusMessage.create([group]));
}