import {
  inject,
  IActor,
  Action,
  IBrokerBus,
  IInjectable,
  Dependencies,
  PrivateBusDependency,
  DependenciesDependency,
} from "@tandem/common";

import { ApplicationConfigurationDependency } from "./dependencies";

/**
 * Application services create the combined functionality of the
 * entiry application.
 */

export abstract class BaseApplicationService2 implements IActor, IInjectable {

  @inject(PrivateBusDependency.ID)
  protected bus: IBrokerBus;

  @inject(DependenciesDependency.ID)
  protected dependencies: Dependencies;

  execute(action: Action) {
    const method = this[action.type];
    if (method) return method.call(this, action);
  }

  $didInject() {
    this.bus.register(this);
  }
}

/**
 * Core service required for the app to run
 */

export abstract class CoreApplicationService<T> extends BaseApplicationService2 {
  @inject(ApplicationConfigurationDependency.ID)
  protected config: T;
}