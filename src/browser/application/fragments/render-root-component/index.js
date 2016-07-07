import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus } from 'common/busses';
import { INITIALIZE } from 'common/application/events';

export default ApplicationFragment.create(
  'render-root-component',
  create
);

function create(app) {

  app.bus.push(TypeCallbackBus.create(INITIALIZE, initialize));

  function initialize(event) {
    var rootComponentClassFragment = app.fragmentDictionary.query('rootComponentClass');

    if (!rootComponentClassFragment) {
      app.logger.warn('rootComponentClass fragment does not exist');
      return;
    }

    var rootComponent = rootComponentClassFragment.create({}, {
      application: app
    });

    app.element.appendChild(rootComponent.render());

    // TODO -- need rAF here.
    app.bus.push(rootComponent);
  }
}
