
import { IActor } from "sf-core/actors";
import { Logger } from "sf-core/logger";
import { BrokerBus } from "sf-core/busses";
import { SequenceBus } from "mesh";
import { IApplication } from "sf-core/application";
import { Dependencies } from "sf-core/dependencies";
import { loggable, bindable } from "sf-core/decorators";
import { LoadAction, InitializeAction } from "sf-core/actions";
import { dependency as consoleLogServiceDependency } from "../services/console-output";

import {
  MainBusDependency,
  DependenciesDependency,
  ApplicationServiceDependency,
  ApplicationSingletonDependency,
} from "sf-core/dependencies";


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
