import Selection from 'editor-fragment/selection/collection';
import { TypeCallbackBus } from 'common/mesh';
import { ApplicationFragment } from 'common/application/fragments';
import { SelectEvent, SELECT } from 'editor-fragment/selection/events';

export const fragment = ApplicationFragment.create({
  ns:'application/selector',
  initialize: initialize
});

function initialize(app) {
  app.busses.push(TypeCallbackBus.create(SELECT, onSelectEvent));

  app.selection = [];

  function onSelectEvent(event) {
    var { items, keepPreviousSelection, toggle } = event;
    var currentSelection = app.selection || [];
    var newSelection;

    if (!items.length) {
      return app.setProperties({ selection: [] });
    }

    var type = items[0].type;

    items.forEach(function(item) {
      if (item.type !== type) throw new Error(`Cannot select multiple items with different types`);
    });

    var selectionCollectionFragment = app.fragmentDictionary.query(`selectorCollection/${type}`);

    if (selectionCollectionFragment) {
      newSelection = selectionCollectionFragment.create();
    } else {
      newSelection = Selection.create();
    }


    if (keepPreviousSelection && currentSelection.constructor == newSelection.constructor) {
      newSelection.push(...currentSelection);
    }

    for (var item of items) {
      var i = newSelection.indexOf(item);

      if (toggle && keepPreviousSelection) {

      }

      // toggle off
      if (~i) {
        if (toggle)  {
          newSelection.splice(i, 1);
        }
      } else {
        newSelection.push(item);
      }
    }

    app.setProperties({ selection: newSelection });
  }
}
