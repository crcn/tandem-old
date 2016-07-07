import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus } from 'common/busses';
import { INITIALIZE } from 'common/application/events';
import * as ReactDOM from 'react-dom';
import throttle from 'lodash/function/throttle';

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

    function render() {
      ReactDOM.render(rootComponentClassFragment.create({
        app: app,
        bus: app.bus
      }), app.element);
    }

    app.bus.push({
      execute: throttle(render, 50)
    });
  }
}
