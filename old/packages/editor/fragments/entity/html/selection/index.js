import {
  SelectionFragment
} from 'editor/fragment/types';

import HTMLEntitySelection from './selection';

export function create({ app }) {
  return [
    SelectionFragment.create({
      id  : 'htmlEntitySelection',
      namespace: 'selection/component',
      factory: HTMLEntitySelection
    })
  ];
}
