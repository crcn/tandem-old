import loggable from 'saffron-common/logger/mixins/loggable';
import { Service } from 'saffron-common/services';
import { FactoryFragment } from 'saffron-common/fragments';
import SelectionCollection from 'saffron-editor-bundle/selection/collection';

@loggable
export default class SelectorService extends Service {
  load() {
    this.app.selection = [];
  }

  /**
   */

  select({ items, toggle, keepPreviousSelection }) {
    const app = this.app;

    if (!items.length) {
      return app.setProperties({
        selection: []
      });
    }

    const prevSelection = app.selection;

    const type = items[0].type;

    const newSelectionFragment = this.app.fragments.query(`selection-collections/${type}`);
    const newSelection = newSelectionFragment ? newSelectionFragment.create() : SelectionCollection.create();

    if (keepPreviousSelection && newSelection.constructor === prevSelection.constructor) {
      newSelection.push(...prevSelection);
    } else {
      newSelection.push(...prevSelection.filter((item) => !!~items.indexOf(item)));
    }

    for (const item of items) {
      var i = newSelection.indexOf(item);
      if (~i) {
        if (toggle) {
          newSelection.splice(i, 1);
        }
      } else {
        newSelection.push(item);
      }
    }

    app.setProperties({
      selection: newSelection
    });
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/services/selector',
  factory : SelectorService
});
