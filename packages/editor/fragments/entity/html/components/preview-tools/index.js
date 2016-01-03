import {
  ComponentFragment
} from 'editor/fragment/types';

import GroupAlignComponent from './components/group-align';
import MarginToolComponent from './components/margin-tool';
import OriginToolComponent from './components/origin-tool';
import PaddingToolComponent from './components/padding-tool';

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
    }),

    // todo - deinitely want this, but need to add in the properties
    // pane instead
    //ComponentFragment.create({
    //  id : 'groupAlignComponent',
    //  componentClass: GroupAlignComponent,
    //  matchesQuery: function({ entityType, componentType }) {
    //    return entityType === 'component' && componentType === 'tool';
    //  }
    //})
  ];
}