import {
  ApplicationFragment
} from 'editor/fragment/types';


export default ApplicationFragment.create({
  id: 'clipboard',
  factory: {
    create: create
  }
});

import { create as createKeyCommandFragments } from './key-commands';

function create({ app }) {
  app.fragments.push(
    ...createKeyCommandFragments({ app })
  );
}
