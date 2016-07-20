import * as sift from 'sift';
import * as ReactDOM from 'react-dom';
import loggable from 'saffron-common/src/decorators/loggable';
import filterAction from 'saffron-common/src/actors/decorators/filter-action';

import BaseApplicationService from 'saffron-common/src/services/base-application-service';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';
import { IApplication } from 'saffron-common/src/application/base';
 
@loggable
export default class RootComponentRenderer extends BaseApplicationService<IApplication> {

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

    var rootComponentClassFragment = this.app.fragments.query<any>('rootComponentClass');

    ReactDOM.render(rootComponentClassFragment.create({
      app: app,
      bus: app.bus
    }), app.element);
  }
}

export const fragment = new ApplicationServiceFragment('application/services/root-component-renderer', RootComponentRenderer);