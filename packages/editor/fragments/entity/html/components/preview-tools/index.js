import {
  ComponentFragment
} from 'editor/fragment/types';

import MarginToolComponent from './components/margin-tool';

export function create({ app }) {
  
  return [
    ComponentFragment.create({
      id             : 'marginToolComponent',
      componentClass : MarginToolComponent,
      matchesQuery: function({ entityType, componentType }) {
        return entityType === 'component' && componentType === 'tool';
      }
    })
  ];
}