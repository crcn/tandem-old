import {
  EntityLayerLabelComponentFragment
} from 'editor/fragment/types';

import TextLayerLabelComponent from './text';
import ElementLayerLabelComponent from './element';

export function create({ app }) {
  return [
    EntityLayerLabelComponentFragment.create({
      id                   : 'textPaneLayerComponent',
      entityComponentType  : 'text',
      componentClass       : TextLayerLabelComponent
    }),

    EntityLayerLabelComponentFragment.create({
      id                   : 'elementLayerLabelComponent',
      entityComponentType  : 'element',
      componentClass       : ElementLayerLabelComponent
    })
  ];
}