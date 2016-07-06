import Selection from 'common/selection/collection';
import { FactoryFragment } from 'common/fragments';

class SelectionPreview {

}

class DisplaySelection extends Selection {
  constructor() {
    super(...arguments);

    this.preview = new SelectionPreview();
  }
}

export const fragment = FactoryFragment.create(
  'selectorCollection',
  DisplaySelection
);
