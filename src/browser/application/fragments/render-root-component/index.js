import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus } from 'common/mesh/bus';
import { WrapBus } from
import { INITIALIZE } from 'common/application/events';
import * as ReactDOM from 'react-dom';
import throttle from 'lodash/function/throttle';

export const fragment = ApplicationFragment.create({
  ns:'application/render-root-component',
  initialize: create
});

function create(app) {

  app.busses.push(TypeCallbackBus.create(INITIALIZE, initialize));

  function initialize(event) {
    var rootComponentClassFragment = app.fragmentDictionary.query('rootComponentClass');

    if (!rootComponentClassFragment) {
      app.logger.warn('rootComponentClass fragment does not exist');
      return;
    }

    function render() {
      console.log('render')
      ReactDOM.render(rootComponentClassFragment.create({
        app: app,
        bus: app.bus
      }), app.element);
    }

    app.busses.push({
      execute: throttle(render, 10)
    });
  }
}
