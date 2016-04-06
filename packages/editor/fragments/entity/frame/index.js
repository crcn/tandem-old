import {
  EntityFragment
} from 'editor/fragment/types';

import {
  ComponentFragment,
  EntityLayerLabelComponentFragment
} from 'editor/fragment/types';

import Frame from './entities/frame';
import FrameLabelComponent from './components/layer-pane-labels/frame';
import FramePreviewComponent from './components/entity-preview';
import FrameLabelContainerComponent from './components/layer-pane-label-containers/frame';

export function create({ app }) {
  return [
    ComponentFragment.create({
      id             : 'framePreview',
      namespace      : 'preview/toolComponents',
      componentClass : FramePreviewComponent
    }),
    EntityFragment.create({
      id        : 'frameEntity',
      namespace : 'entities/frame',
      factory   : Frame
    }),

    EntityLayerLabelComponentFragment.create({
      id             : 'frameLayerLabel',
      namespace      : 'layer/labels/frame',
      componentClass : FrameLabelComponent
    }),

    ComponentFragment.create({
      id             : 'frameLayerLabel',
      namespace      : 'layer/labelContainer/frame',
      componentClass : FrameLabelContainerComponent
    })
  ];
};
