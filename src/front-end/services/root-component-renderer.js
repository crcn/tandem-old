import sift from 'sift';
import ReactDOM from 'react-dom';
import loggable from 'common/logger/mixins/loggable';
import filterAction from 'common/actors/decorators/filter-action';

import { BaseActor } from 'common/actors';
import { FactoryFragment } from 'common/fragments';

@loggable
export default class RootComponentRenderer extends BaseActor {

  @filterAction(sift({
    type: {
      $ne: /log/,
    },
  }))
  execute() {
    if (this._rendering) return;
    this._rendering = true;
    setTimeout(this.render, 10);
  }

  render = () => {
    this.logger.verbose('render');
    this._rendering = false;
    var app = this.app;

    var rootComponentClassFragment = this.app.fragments.query('rootComponentClass');

    ReactDOM.render(rootComponentClassFragment.create({
      app: app,
      bus: app.bus,
    }), app.element);
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/actors/root-component-renderer',
  factory : RootComponentRenderer,
});
