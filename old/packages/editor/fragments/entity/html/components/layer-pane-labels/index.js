import {
  EntityLayerLabelComponentFragment
} from 'editor/fragment/types';

import TextLayerLabelComponent from './text';
import ElementLayerLabelComponent from './element';

export function create({ app }) {
  return [
    EntityLayerLabelComponentFragment.create({
      id                   : 'textPaneLayerComponent',
      namespace            : 'layer/labels/text',
      componentClass       : TextLayerLabelComponent
    }),

    EntityLayerLabelComponentFragment.create({
      id                   : 'elementLayerLabelComponent',
      namespace            : 'layer/labels/element',
      componentClass       : ElementLayerLabelComponent
    })
  ];
}
