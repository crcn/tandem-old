
// TODO - move this over to the preview fragment
import LayersPaneComponent from './components/layers';

import {
  AppPaneComponentFragment
} from 'editor/fragment/types';


export function create({ app }) {
  return [
    AppPaneComponentFragment.create({
      id             : 'layersPane',
      label          : 'Layers',
      componentClass : LayersPaneComponent
    })
  ]
}