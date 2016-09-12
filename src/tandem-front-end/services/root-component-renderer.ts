import * as sift from "sift";
import { Logger } from "tandem-common/logger";
import { throttle } from "lodash";
import * as ReactDOM from "react-dom";
import { IApplication } from "tandem-common/application";
import { filterAction, loggable } from "tandem-common/decorators";
import { BaseApplicationService } from "tandem-common/services";
import { ClassFactoryDependency } from "tandem-common/dependencies";
import { ApplicationServiceDependency } from "tandem-common/dependencies";
import { RootReactComponentDependency } from "tandem-front-end/dependencies";

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