import './scss/modules/all.scss';

import { ApplicationFragment } from 'common/application/fragments';
import { fragment as rootEditorComponentFragment } from './components/root';
import { FactoryFragment } from 'common/fragments';

export default ApplicationFragment.create(
  'editor',
  create
);

function create(app) {
  app.fragmentDictionary.register(
    rootEditorComponentFragment
  );
}
