
import { create as createPreviewFragments } from './preview';
import { create as createKeyCommandFragments } from './key-commands';
import { create as createEditorLayerLabelFragments } from './layer-labels';
import { create as createEditorPropertyPaneFragments } from './property-pane';

export function create({ app }) {
  return [
    ...createPreviewFragments({ app }),
    ...createKeyCommandFragments({ app }),
    ...createEditorLayerLabelFragments({ app }),
    ...createEditorPropertyPaneFragments({ app })
  ];
}