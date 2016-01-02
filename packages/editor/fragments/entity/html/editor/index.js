
import { create as createPreviewFragments } from './preview-component';
import { create as createSelectionFragment } from './selection';
import { create as createKeyCommandFragments } from './key-commands';
import { create as createEditorLayerLabelFragments } from './layer-label-components';
import { create as createEditorPropertyPaneFragments } from './property-pane-component';

export function create({ app }) {
  return [
    ...createPreviewFragments({ app }),
    ...createSelectionFragment({ app }),
    ...createKeyCommandFragments({ app }),
    ...createEditorLayerLabelFragments({ app }),
    ...createEditorPropertyPaneFragments({ app })
  ];
}