import {
  inject,
  IActor,
  Action,
  loggable,
  Logger,
  IBrokerBus,
  IInjectable,
  Injector,
  PrivateBusProvider,
  InjectorProvider,
} from "@tandem/common";

import { ApplicationConfigurationProvider } from "./providers";

/**
 * Application services create the combined functionality of the
 * entiry application.
 */

export abstract class BaseApplicationService implements IActor, IInjectable {

  protected readonly logger: Logger;

  @inject(PrivateBusProvider.ID)
  protected bus: IBrokerBus;

  @inject(InjectorProvider.ID)
  protected injector: Injector;

  execute(action: Action) {
    const method = this[action.type];
    if (method) {
      if (this.logger) {
        this.logger.verbose("%s()", action.type);
      }
      return method.call(this, action);
    }
  }

  $didInject() {
    this.bus.register(this);
  }
}

/**
 * Core service required for the app to run
 */

export abstract class CoreApplicationService<T> extends BaseApplicationService {
  @inject(ApplicationConfigurationProvider.ID)
  protected config: T;
}