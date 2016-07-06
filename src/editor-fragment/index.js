import './scss/modules/all.scss';

import { ApplicationFragment } from 'common/application/fragments';
import { fragment as rootEditorComponentFragment } from './components/root';
import { fragment as selectorToolComponentFragment } from './components/stage-tools/selector';

export default ApplicationFragment.create(
  'editor',
  create
);

function create(app) {

  app.fragmentDictionary.register(
    rootEditorComponentFragment,

    // tools
    selectorToolComponentFragment
  );
}
