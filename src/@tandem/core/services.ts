import {
  inject,
  Action,
  loggable,
  Logger,
  IBrokerBus,
  IInjectable,
  Injector,
  PrivateBusProvider,
  InjectorProvider,
} from "@tandem/common";

import {  IDispatcher } from "@tandem/mesh";
import { ApplicationConfigurationProvider } from "./providers";

/**
 * Application services create the combined functionality of the
 * entiry application.
 */

export abstract class BaseApplicationService implements  IDispatcher<any, any>, IInjectable {

  protected readonly logger: Logger;

  @inject(PrivateBusProvider.ID)
  protected bus: IBrokerBus;

  @inject(InjectorProvider.ID)
  protected injector: Injector;

  dispatch(action: Action) {
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