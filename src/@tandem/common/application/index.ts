// DEPRECATED
export * from "./base";

// import { fileModelProvider } from "../models";

import { IActor } from "@tandem/common/actors";
import { Logger } from "@tandem/common/logger";
import { BrokerBus } from "@tandem/common/busses";
import { SequenceBus } from "mesh";
import { IApplication } from "@tandem/common/application";
import { Injector } from "@tandem/common/ioc";
import { loggable, bindable } from "@tandem/common/decorators";
import { LoadAction, InitializeAction } from "@tandem/common/actions";
// import {  consoleLogServiceProvider } from "../services";

import {
  PrivateBusProvider,
  InjectorProvider,
  ApplicationServiceProvider,
  ApplicationSingletonProvider,
} from "@tandem/common/ioc";

export * from "./base";

// @observable
@loggable()
export class BaseApplication implements IApplication {

  readonly logger: Logger;
  readonly bus: BrokerBus = new BrokerBus(SequenceBus);
  readonly injector: Injector = new Injector();
  private _initializeCalled: boolean = false;

  constructor(readonly config: any = {}) {
    this.registerProviders();
  }

  public async initialize() {

    if (this._initializeCalled) {
      throw new Error("Cannot initialize application more than once.");
    }

    this._initializeCalled = true;

    // initialize the services so that they can handle load &
    // initialize actions when they're executed
    this._initializeServices();

    this.willInitialize();
    await this.bus.execute(new LoadAction());
    await this.bus.execute(new InitializeAction());
    this.didInitialize();
  }

  /**
   */

  protected registerProviders() {
    // Make the application available globally through the injector
    // property so that this reference isn't passed around everywhere.
    this.injector.register(
      new PrivateBusProvider(this.bus),
      new InjectorProvider(),
      new ApplicationSingletonProvider(this)
    );
  }

  /**
   */

  private _initializeServices() {

    // Initialize the services (action handlers) of this application.
    this.bus.register(...ApplicationServiceProvider.findAll(this.injector).map(fragment => fragment.create()));
  }

  /**
   */

  protected willInitialize() {
    // OVERRIDE ME
  }

  /**
   */

  protected didInitialize() {
    this.logger.info("initialized");
  }
}



export class Application extends BaseApplication {
  protected registerProviders() {
    super.registerProviders();
  }
}