export * from "./base";

import { fileModelDependency } from "../models";

import { IActor } from "sf-common/actors";
import { Logger } from "sf-common/logger";
import { BrokerBus } from "sf-common/busses";
import { SequenceBus } from "mesh";
import { IApplication } from "sf-common/application";
import { Dependencies } from "sf-common/dependencies";
import { loggable, bindable } from "sf-common/decorators";
import { LoadAction, InitializeAction } from "sf-common/actions";
import {  consoleLogServiceDependency } from "../services";

import {
  MainBusDependency,
  DependenciesDependency,
  ApplicationServiceDependency,
  ApplicationSingletonDependency,
} from "sf-common/dependencies";

export * from "./base";

// @observable
@loggable()
export class BaseApplication implements IApplication {

  readonly logger: Logger;
  readonly bus: BrokerBus = new BrokerBus(SequenceBus);
  readonly dependencies: Dependencies = new Dependencies();
  private _initializeCalled: boolean = false;

  constructor(readonly config: any = {}) {
    this.registerDependencies();
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

  protected registerDependencies() {
    if (!process.env.TESTING) {
      this.dependencies.register(consoleLogServiceDependency);
    }

    // Make the application available globally through the dependencies
    // property so that this reference isn't passed around everywhere.
    this.dependencies.register(
      new MainBusDependency(this.bus),
      new DependenciesDependency(),
      new ApplicationSingletonDependency(this)
    );
  }

  /**
   */

  private _initializeServices() {

    // Initialize the services (action handlers) of this application.
    this.bus.register(...ApplicationServiceDependency.findAll(this.dependencies).map(fragment => fragment.create()));
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
  protected registerDependencies() {
    super.registerDependencies();
    this.dependencies.register(
      fileModelDependency
    );
  }
}