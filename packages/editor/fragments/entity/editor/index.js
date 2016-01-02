import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createPreviewFragment } from './preview';
import { create as createPasteFragment } from './clipboard-handle-paste';
import { create as createLayerComponentFragment } from './layers-pane-component';

export function create({ app }) {
  return [
    ...createPreviewFragment({ app }),
    ...createPasteFragment({ app }),
    ...createLayerComponentFragment({ app })
  ];
}
