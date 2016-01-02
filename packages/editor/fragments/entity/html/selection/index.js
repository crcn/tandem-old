import {
  SelectionFragment
} from 'editor/fragment/types';

import HTMLEntitySelection from './selection';

export function create({ app }) {
  return [
    SelectionFragment.create({
      id  : 'htmlEntitySelection',
      entityType: 'component',
      factory: HTMLEntitySelection
    })
  ];
}