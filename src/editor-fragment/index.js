import { ApplicationFragment } from 'common/application/fragments';
import { fragment as rootEditorViewFragment } from './views/root';
import { FactoryFragment } from 'common/fragments';

export default ApplicationFragment.create(
  'editor',
  create
);

function create(app) {
  app.fragmentDictionary.register(
    rootEditorViewFragment
  );
}
