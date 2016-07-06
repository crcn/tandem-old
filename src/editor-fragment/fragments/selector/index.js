import { ApplicationFragment } from 'common/application/fragments';
import { SelectEvent, SELECT } from 'common/selection/events';
import { TypeDispatcher, CallbackDispatcher } from 'common/dispatchers';
import Selection from 'common/selection/collection';

export const fragment = ApplicationFragment.create(
  'application/selector',
  initialize
);

function initialize(app) {
  app.bus.observe(TypeDispatcher.create(SELECT, CallbackDispatcher.create(select)))

  function select(event) {
    var { item, multi } = event;
    var currentSelection = app.selection || [];
    var newSelection;

    if (!item) {
      return app.setProperties({ selection: [] });
    }

    var selectionCollectionFragment = app.fragmentDictionary.query(`selectorCollection/${item.type}`);

    if (selectionCollectionFragment) {
      newSelection = selectionCollectionFragment.create();
    } else {
      newSelection = Selection.create();
    }

    if (multi && currentSelection.constructor == newSelection.constructor) {
      newSelection.push(...currentSelection);
    }

    var i = newSelection.indexOf(item);

    // toggle off
    if (~i) {
      newSelection.splice(i, 1);
    } else {
      newSelection.push(item);
    }

    app.setProperties({ selection: newSelection });
  }
}
