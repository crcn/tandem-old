import './scss/modules/all.scss';

import { ApplicationFragment } from 'common/application/fragments';
import { fragment as rootEditorComponentFragment } from './components/root';
import { default as htmlFragment } from './html';

export default ApplicationFragment.create(
  'editor',
  create
);

function create(app) {
  app.fragmentDictionary.register(
    rootEditorComponentFragment
  );

  htmlFragment.initialize(app);
}
