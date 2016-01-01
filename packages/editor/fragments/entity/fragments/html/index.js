import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createFontFragments } from './fragments/fonts';
import { create as createEntityFragments } from './fragments/entities';
import { create as createEditorFragments } from './fragments/editor';
import { create as createCSSUnitFragments } from './fragments/css-units';

export function create({ app }) {
  return [
    ...createEntityFragments({ app }),
    ...createCSSUnitFragments({ app }),
    ...createEditorFragments({ app }),
    ...createFontFragments({ app })
  ];
}
