import * as sift from 'sift';
import * as ReactDOM from 'react-dom';
import loggable from 'saffron-common/lib/decorators/loggable';
import filterAction from 'saffron-common/lib/actors/decorators/filter-action';

import BaseApplicationService from 'saffron-common/lib/services/base-application-service';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
 
@loggable
export default class RootComponentRenderer extends BaseApplicationService {

  private _rendering:boolean;

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
    this._rendering = false;
    var app = this.app;

    var rootComponentClassFragment = this.app.fragments.query('rootComponentClass');

    ReactDOM.render(rootComponentClassFragment.create({
      app: app,
      bus: app.bus
    }), app.element);
  }
}

export const fragment = new ClassFactoryFragment('application/services/root-component-renderer', RootComponentRenderer);