
// TODO - move this over to the preview fragment
import LayersPaneComponent from './layers';

import {
  AppPaneComponentFragment
} from 'editor/fragment/types';


export function create({ app }) {
  return [
    AppPaneComponentFragment.create({
      id             : 'layersPane',
      namespace      : 'panes/app',
      label          : 'Layers',
      componentClass : LayersPaneComponent
    })
  ]
}
