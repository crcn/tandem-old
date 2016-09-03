import * as sift from "sift";
import { Logger } from "sf-common/logger";
import * as ReactDOM from "react-dom";
import { IApplication } from "sf-common/application";
import { filterAction, loggable } from "sf-common/decorators";
import { BaseApplicationService } from "sf-common/services";
import { ClassFactoryDependency } from "sf-common/dependencies";
import { ApplicationServiceDependency } from "sf-common/dependencies";
import { RootReactComponentDependency } from "sf-front-end/dependencies";

@loggable()
export default class RootComponentRenderer extends BaseApplicationService<IApplication> {

  public logger: Logger;
  private _rendering: boolean;

  @filterAction(sift({
    type: {
      $ne: /log/
    },
  }))
  execute() {
    if (this._rendering) return;
    this._rendering = true;
    requestAnimationFrame(this.render);
  }

  render = () => {
    this._rendering = false;
    const app = this.app;

    const rootComponentClassDependency = RootReactComponentDependency.find(this.app.dependencies);

    if (!rootComponentClassDependency) {
      this.logger.warn("Root React component was not found.");
      return;
    }

    ReactDOM.render(rootComponentClassDependency.create({

      // deprecated
      app: app,

      // deprecated
      bus: app.bus,
      dependencies: app.dependencies
    }), app.config.element);
  }
}

export const dependency = new ApplicationServiceDependency("root-component-renderer", RootComponentRenderer);