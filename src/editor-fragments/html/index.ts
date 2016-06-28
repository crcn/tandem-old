import BaseApplication from 'common/application/base';
import ApplicationFragment from 'common/fragments/application';

export default new ApplicationFragment(create);

function create(app:BaseApplication) {
  app.fragments.push();
}

