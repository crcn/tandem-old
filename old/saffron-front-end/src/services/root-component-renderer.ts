import * as sift from 'sift';
import * as ReactDOM from 'react-dom';
import loggable from 'sf-common/decorators/loggable';
import filterAction from 'sf-common/actors/decorators/filter-action';

import IApplication from 'sf-common/application/interface';
import BaseApplicationService from 'sf-common/services/base-application-service';
import { ClassFactoryFragment } from 'sf-common/fragments/index';
import { ApplicationServiceFragment } from 'sf-common/fragments/index';

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
    }), (app as any).element);
  }
}

export const fragment = new ApplicationServiceFragment('application/services/root-component-renderer', RootComponentRenderer);