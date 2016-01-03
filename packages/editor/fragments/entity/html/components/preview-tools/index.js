import {
  ComponentFragment
} from 'editor/fragment/types';

import MarginToolComponent from './components/margin-tool';
import PaddingToolComponent from './components/padding-tool';
import OriginToolComponent from './components/origin-tool';

export function create({ app }) {

  return [
    ComponentFragment.create({
      id             : 'marginToolComponent',
      componentClass : MarginToolComponent,
      matchesQuery: function({ entityType, componentType }) {
        return entityType === 'component' && componentType === 'tool';
      }
    }),

    ComponentFragment.create({
      id             : 'originToolComponent',
      componentClass : OriginToolComponent,
      matchesQuery: function({ entityType, componentType }) {
        return entityType === 'component' && componentType === 'tool';
      }
    }),

    ComponentFragment.create({
      id             : 'paddingToolComponent',
      componentClass : PaddingToolComponent,
      matchesQuery: function({ entityType, componentType }) {
        return entityType === 'component' && componentType === 'tool';
      }
    })
  ];
}