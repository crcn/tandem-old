import loggable from 'saffron-common/src/decorators/loggable';
import BaseApplicationService from 'saffron-common/src/services/base-application-service';
import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';
import SelectionCollection from 'selection/collection';

@loggable
export default class SelectorService extends BaseApplicationService<IApplication> {
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

    const newSelectionFragment = this.app.fragments.query<any>(`selection-collections/${type}`);
    const newSelection = newSelectionFragment ? newSelectionFragment.create() : new SelectionCollection();

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

export const fragment = new ApplicationServiceFragment('application/services/selector', SelectorService);