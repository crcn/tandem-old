import { FactoryFragment } from 'common/fragments';
import { BaseActor } from 'common/actors';
import ReactDOM from 'react-dom';
import React from 'react';
import loggable from 'common/logger/mixins/loggable';

@loggable
export default class RootComponentRenderer extends BaseActor {

  execute(action) {
    if (this._rendering) return;
    this._rendering = true;
    setTimeout(this.render, 10);
  }

  render = () => {
    this._rendering = false;
    var app = this.app;

    var rootComponentClassFragment = this.app.fragmentDictionary.query('rootComponentClass');

    ReactDOM.render(rootComponentClassFragment.create({
      app: app,
      bus: app.bus,
    }), app.element);
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/actors/root-component-renderer',
  factory: RootComponentRenderer
})
