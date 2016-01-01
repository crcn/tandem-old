import {
  EntityLayerLabelComponentFragment
} from 'editor/fragment/types';

import TextLayerLabelComponent from './components/text';

export function create({ app }) {
  return [
    EntityLayerLabelComponentFragment.create({
      id             : 'textPaneLayerComponent',
      layerType      : 'text',
      entityType     : 'component',
      componentClass : TextLayerLabelComponent
    })
  ];
}