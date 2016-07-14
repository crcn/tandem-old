import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus } from 'common/mesh';
import { WrapBus } from 'mesh';
import { INITIALIZE } from 'common/application/events';
import * as ReactDOM from 'react-dom';
import throttle from 'lodash/function/throttle';

export const fragment = ApplicationFragment.create({
  ns: 'application/renderRootComponent',
  initialize: create,
});

function create(app) { 

  app.busses.push(TypeCallbackBus.create(INITIALIZE, initialize));

  function initialize() {
    var rootComponentClassFragment = app.fragmentDictionary.query('rootComponentClass');

    if (!rootComponentClassFragment) {
      app.logger.warn('rootComponentClass fragment does not exist');
      return;
    }

    function render() {
      ReactDOM.render(rootComponentClassFragment.create({
        app: app,
        bus: app.bus,
      }), app.element);
    }

    app.busses.push(WrapBus.create(throttle(render, 10)));
  }
}
