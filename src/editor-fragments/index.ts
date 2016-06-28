
import BaseApplicaton from 'common/application/base';
import ApplicationFragment from 'common/fragments/application';
import { fragment as editorComponentFragment } from './components/editor/index';
import { default as htmlFragment } from './html/index';

export default new ApplicationFragment(create);

function create(app:BaseApplicaton) {

  // register all fragments
  // that are generic where they can be used with any
  // rendering engine
  app.fragments.push(
    editorComponentFragment
  );

  // register the HTML fragments that
  // need to get hooked into the editor
  htmlFragment.create(app);
}
