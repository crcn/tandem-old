import {
  ApplicationFragment,
  UnitFragment
} from 'editor/fragment/types';


import { create as createFontFragments } from './fonts';
import { create as createEntityFragments } from './entities';
import { create as createFragments } from './fragments';
import { create as createPreviewTools } from './components/preview-tools';
import { createFragment as createAttributesPaneFragment } from './components/panes/attributes';
import { createFragments as createPropertyInputFragments } from './components/panes/inputs';

import { create as createPreviewFragments } from './components/entity-preview';
import { create as createSelectionFragment } from './selection';
import { create as createKeyCommandFragments } from './key-commands';
import { create as createEditorLayerLabelFragments } from './components/layer-pane-labels';
import { create as createEditorPropertyPaneFragments } from './components/panes/styles';
import { create as createAddedFileHandleFragments } from './handle-added-file';

export function create({ app }) {
  return [
    ...createFragments({ app }),
    ...createEntityFragments({ app }),
    ...createFontFragments({ app }),
    ...createPreviewTools({ app }),
    createAttributesPaneFragment({ app }),
    ...createPropertyInputFragments({ app }),

    ...createPreviewFragments({ app }),
    ...createSelectionFragment({ app }),
    ...createKeyCommandFragments({ app }),
    ...createEditorLayerLabelFragments({ app }),
    ...createEditorPropertyPaneFragments({ app }),
    ...createAddedFileHandleFragments({ app })
  ];
}
