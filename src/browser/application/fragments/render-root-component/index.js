import { ApplicationFragment } from 'common/application/fragments';
import CallbackDispatcher from 'common/dispatchers/callback';
import { INITIALIZE } from 'common/application/events';
import TypeDispatcher from 'common/dispatchers/type';

export default ApplicationFragment.create(
  'render-root-component',
  create
);

function create(app) {

  app.bus.observe(
    TypeDispatcher.create(
      INITIALIZE,
      CallbackDispatcher.create(initialize)
    )
  );

  function initialize(event) {
    var rootViewClassFragment = app.fragmentDictionary.query('rootViewClass');

    if (!rootViewClassFragment) {
      app.logger.warn('rootViewClass fragment does not exist');
      return;
    }

    var rootView = rootViewClassFragment.create({
      application: app
    });

    app.element.appendChild(rootView.node);
  }
}

/*

class Controller extends ViewContoller {
  compute()
}
*/
