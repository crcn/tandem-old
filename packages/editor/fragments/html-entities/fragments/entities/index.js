import {
  EntityFragment
} from 'editor/fragment/types';

import Element from './element';
import Root from './root';
import Text from './text';

export function create({ app }) {
  return [
    EntityFragment.create({
      id      : 'rootEntity',
      factory : Root
    }),

    // text
    EntityFragment.create({
      id      : 'textEntity',
      factory : Text
    }),

    // element
    EntityFragment.create({
      id      : 'elementEntity',
      factory : Element
    })
  ]
}

