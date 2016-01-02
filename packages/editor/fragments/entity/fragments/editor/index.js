import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createPreviewFragment } from './fragments/preview';
import { create as createLayerFragment } from './fragments/layers-pane';
import { create as createPasteFragment } from './fragments/clipboard-handle-paste';

export function create({ app }) {
  return [
    ...createPreviewFragment({ app }),
    ...createLayerFragment({ app }),
    ...createPasteFragment({ app })
  ];
}
