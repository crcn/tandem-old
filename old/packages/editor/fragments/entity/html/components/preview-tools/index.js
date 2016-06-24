import {
  ComponentFragment
} from 'editor/fragment/types';

import GroupAlignComponent from './components/group-align';
import MarginToolComponent from './components/margin-tool';
import OriginToolComponent from './components/origin-tool';
import PaddingToolComponent from './components/padding-tool';

export function create({ app }) {

  return [

    // toolComponents/component
    ComponentFragment.create({
      id             : 'marginToolComponent',
      namespace      : 'preview/tools',
      componentClass : MarginToolComponent
    }),

    // toolComponents/component
    ComponentFragment.create({
      id             : 'originToolComponent',
      namespace      : 'preview/tools',
      componentClass : OriginToolComponent
    }),

    // /toolComponents/component
    ComponentFragment.create({
      id             : 'paddingToolComponent',
      namespace      : 'preview/tools',
      componentClass : PaddingToolComponent
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
