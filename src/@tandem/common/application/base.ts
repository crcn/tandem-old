import { SequenceBus } from "mesh";
import { IActor, IInvoker } from '../actors';
import { IBrokerBus, BrokerBus } from "@tandem/common/busses";
import { LoadAction, InitializeAction } from "../actions";
import {
  Dependency,
  Dependencies,
  MainBusDependency,
  PublicBusDependency,
  PrivateBusDependency,
  ProtectedBusDependency,
} from '../dependencies';

/**
 * @deprecated
 */

export interface IApplication extends IInvoker {

  // the application configuration on startup
  readonly config: any;

  // actors of the application bus
  readonly bus: IBrokerBus;

  // parts of the application
  readonly dependencies: Dependencies;
}

/**
 * Main entry point into the entire application -- ties everything together. Minimal
 * in functionality.
 */

export interface IApplication2<T> {

  /**
   * The configuration of the application
   */

  readonly config: T;

  /**
   * The dependencies of the application. This is the glue of the application
   * that contains singletons, and dependencies, of other dependencies.
   */

  readonly dependencies: Dependencies;
}

/**
 * The application configuration dependency
 */

export class ConfigurationDependency<T> extends Dependency<T> {
  static ID: string = "config";
  constructor(value: T) {
    super(ConfigurationDependency.ID, value);
  }
}

/**
 */

export abstract class BaseApplication<T> implements IApplication2<T> {

  private _privateBus: IActor;

  /**
   * Constructor
   *
   * @param {any} [readonly=config] the application configuration used by dependencies
   * @param {Dependencies} [readonly=dependencies] existing dependencies to inject into the application. Otherwise a an empty Dependencies instance is created
   */

  constructor(readonly config: T, readonly dependencies: Dependencies = new Dependencies()) { }

  /**
   * Bootstraps the application
   */

  async initialize() {
    this.registerDependencies();

    // Prepare the application for initialization. Dependencies that
    // need to be loaded before being used by other dependencies should listen on this action
    // here.
    await this._privateBus.execute(new LoadAction());

    // Notify the application that everything is ready
    await this._privateBus.execute(new InitializeAction());
  }

  /**
   */

  protected registerDependencies() {
    this.registerBusses();
  }

  /**
   * Registers all message busses
   */

  private registerBusses() {

    // Notice the bubbling action here. Actions dispatched on the private bus will
    // make its way to the public bus. However, actions also have access levels. If an action
    // invoked against the public bus is not also public, then the action will never reach the outside world.

    // The levels here are mainly intented to expose layers of the application that are publicly accessible
    // to outside resources. The public bus is intented for public APIs, and is accessible to anyone, The protected bus is
    // available to trusted resources such as workers, databases, and other services. The private bus is reserved for internal
    // communication only. This includes things such as application loading, initialization, rendering (browser), and other actions
    // that are useless to both public, and protected actors.

    const publicActors = [];
    const publicBus    = new SequenceBus(publicActors);

    const protectedActors = [publicBus];
    const protectedBus    = new SequenceBus(protectedActors);

    const privateActors = [protectedBus];
    const privateBus    = this._privateBus = new SequenceBus(privateActors);

    this.dependencies.register(
      new PublicBusDependency(publicBus, publicActors),
      new ProtectedBusDependency(protectedBus, protectedActors),
      new PrivateBusDependency(privateBus, privateActors),

      // make the application config available to the entire application
      new ConfigurationDependency(this.config)
    )
  }
}