import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createFontFragments } from './fonts';
import { create as createEntityFragments } from './entities';
import { create as createEditorFragments } from './editor';
import { create as createCSSUnitFragments } from './css-units';

export function create({ app }) {
  return [
    ...createEntityFragments({ app }),
    ...createCSSUnitFragments({ app }),
    ...createEditorFragments({ app }),
    ...createFontFragments({ app })
  ];
}
