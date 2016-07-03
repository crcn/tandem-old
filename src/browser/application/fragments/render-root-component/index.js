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
    var rootComponentClassFragment = app.fragmentDictionary.query('rootComponentClass');

    if (!rootComponentClassFragment) {
      app.logger.warn('rootComponentClass fragment does not exist');
      return;
    }

    var rootComponent = rootComponentClassFragment.create({
      application: app
    });

    app.element.appendChild(rootComponent.render());
  }
}

/*

class Controller extends ViewContoller {
  compute()
}
*/
