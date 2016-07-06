import './scss/modules/all.scss';

import { ApplicationFragment } from 'common/application/fragments';
import { fragment as rootEditorComponentFragment } from './components/root';
import { fragment as originToolComponentFragment } from './components/stage-tools/origin';
import { fragment as selectorToolComponentFragment } from './components/stage-tools/selector';
import { default as htmlFragment } from './html';

export default ApplicationFragment.create(
  'editor',
  create
);

function create(app) {

  app.fragmentDictionary.register(
    rootEditorComponentFragment,

    // tools
    originToolComponentFragment,
    selectorToolComponentFragment
  );

  htmlFragment.initialize(app);
}
