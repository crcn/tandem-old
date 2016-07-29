import { Logger } from "sf-core/logger";
import { loggable, bindable } from "sf-core/decorators";
import {
  ApplicationServiceDependency,
  BusDependency,
  ApplicationSingletonDependency,
  DependenciesDependency
} from "sf-core/dependencies";
import { LoadAction, InitializeAction } from "sf-core/actions";
import { fragment as consoleLogServiceDependency } from "../services/console-output";

import { IActor } from "sf-core/actors";
import { IApplication } from "sf-core/application";
import { Dependencies } from "sf-core/dependencies";

import { ParallelBus } from "mesh";

// @observable
@loggable()
export class Application implements IApplication {

  readonly logger: Logger;
  readonly actors: Array<IActor> = [];
  readonly bus: IActor = new ParallelBus(this.actors);
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
      new BusDependency(this.bus),
      new DependenciesDependency(this.dependencies),
      new ApplicationSingletonDependency(this)
    );
  }

  /**
   */

  private _initializeServices() {

    // Initialize the services (action handlers) of this application.
    this.actors.push(...ApplicationServiceDependency.findAll(this.dependencies).map(fragment => fragment.create()));
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
