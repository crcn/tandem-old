import {
  EntityFragment
} from 'editor/fragment/types';

import Element from './element';
import Text from './text';

export function create({ app }) {
  return [

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

