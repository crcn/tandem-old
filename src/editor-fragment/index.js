import './scss/modules/all.scss';

import { ApplicationFragment } from 'common/application/fragments';
import { fragment as rootEditorComponentFragment } from './components/root';
import { fragment as selectorToolComponentFragment } from './components/stage-tools/selector';
import { fragment as selectableToolComponentFragment } from './components/stage-tools/selectable';

export default ApplicationFragment.create(
  'editor',
  create
);

function create(app) {

  app.fragmentDictionary.register(
    rootEditorComponentFragment,

    // tools
    selectorToolComponentFragment,
    selectableToolComponentFragment
  );
}
