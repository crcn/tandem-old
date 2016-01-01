import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createEntityFragments } from './fragments/entities';
import { create as createCSSUnitFragments } from './fragments/css-units';
import { create as createEditorFragments } from './fragments/editor';
import { create as createFontFragments } from './fragments/fonts';

export default ApplicationFragment.create({
  id: 'basicDOMEntities',
  factory: {
    create({ app }) {
      app.fragments.push(
        ...createEntityFragments({ app }),
        ...createCSSUnitFragments({ app }),
        ...createEditorFragments({ app }),
        ...createFontFragments({ app })
      );
    }
  }
});

