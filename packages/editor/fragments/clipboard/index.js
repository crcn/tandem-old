import {
  ApplicationFragment
} from 'editor/fragment/types';


export default ApplicationFragment.create({
  id: 'clipboard',
  factory: {
    create: create
  }
});

import { create as createHandlePasteFragments } from './fragments/handle-paste';
import { create as createKeyCommandFragments } from './fragments/key-commands';

function create({ app }) {

  app.fragments.push(
    ...createHandlePasteFragments({ app }),
    ...createKeyCommandFragments({ app })
  );

}
