
import { create as createKeyCommandFragments } from './fragments/key-commands';
import { create as createPreviewRepFragments } from './fragments/preview-reps';
import { create as createEditorLayerLabelFragments } from './fragments/layer-labels';
import { create as createEditorPropertyPaneFragments } from './fragments/property-pane';

export function create({ app }) {
  return [
    ...createKeyCommandFragments({ app }),
    ...createPreviewRepFragments({ app }),
    ...createEditorLayerLabelFragments({ app }),
    ...createEditorPropertyPaneFragments({ app })
  ];
}