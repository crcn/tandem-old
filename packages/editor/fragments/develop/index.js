import {
  ApplicationFragment
} from 'editor/fragment/types';

import { create as createTestProjectFragment } from './fragments/test-project';

export default ApplicationFragment.create({
  id: 'develop',
  factory: {
    create: create
  }
});

function create({ app }) {
  app.fragments.push(
    ...createTestProjectFragment({ app })
  );
}