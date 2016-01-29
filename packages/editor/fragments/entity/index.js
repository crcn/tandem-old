import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createHTMLFragment } from './html';

import { create as createPreviewFragment } from './components/preview';
import { create as createPasteFragment } from './clipboard/handle-paste';
import { create as createLayerComponentFragment } from './components/layers-pane';
import { create as createFrameFragment } from './frame';

export default ApplicationFragment.create({
  id: 'basicDOMEntities',
  factory: {
    create({ app }) {
      app.fragments.register(
        ...createPreviewFragment({ app }),
        ...createPasteFragment({ app }),
        ...createLayerComponentFragment({ app }),
        ...createHTMLFragment({ app }),
        ...createFrameFragment({ app })
      );
    }
  }
});
