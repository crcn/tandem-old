import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createHTMLFragment } from './html';
import { create as createEditorFragment } from './editor';

export default ApplicationFragment.create({
  id: 'basicDOMEntities',
  factory: {
    create({ app }) {
      app.fragments.push(
        ...createEditorFragment({ app }),
        ...createHTMLFragment({ app })
      );
    }
  }
});

