
import { create as createKeyCommandFragments } from './key-commands';
import { create as createPreviewRepFragments } from './preview-reps';
import { create as createEditorLayerLabelFragments } from './layer-labels';
import { create as createEditorPropertyPaneFragments } from './property-pane';

export function create({ app }) {
  return [
    ...createKeyCommandFragments({ app }),
    ...createPreviewRepFragments({ app }),
    ...createEditorLayerLabelFragments({ app }),
    ...createEditorPropertyPaneFragments({ app })
  ];
}