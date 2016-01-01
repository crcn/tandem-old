import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createPreviewFragment } from './fragments/preview';
import { create as createLayerFragment } from './fragments/layers-pane';

export function create({ app }) {
  return [
    ...createPreviewFragment({ app }),
    ...createLayerFragment({ app })
  ];
}
