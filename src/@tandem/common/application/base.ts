import { SequenceBus } from "mesh";
import { IActor, IInvoker } from '../actors';
import { IBrokerBus, BrokerBus } from "@tandem/common/busses";
import { LoadAction, InitializeAction } from "../actions";
import {
  Provider,
  Dependencies,
  PrivateBusProvider,
} from '../ioc';

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
 */

export class Application2 {

  protected bus: IActor;
  private _initialized: boolean;

  constructor(readonly dependencies: Dependencies) {
    this.bus = PrivateBusProvider.getInstance(dependencies);
  }

  /**
   * Bootstraps the application
   */

  async initialize() {
    if (this._initialized) {
      throw new Error(`Attempting to initialize the application after it's already been initialized.`);
    }

    this._initialized = true;
    this.willLoad();

    // Prepare the application for initialization. Dependencies that
    // need to be loaded before being used by other dependencies should listen on this action
    // here.
    await this.bus.execute(new LoadAction());

    this.didLoad();
    this.willInitialize();

    // Notify the application that everything is ready
    await this.bus.execute(new InitializeAction());

    this.didInitialize();
  }

  /**
   */

  protected willLoad() {
    // OVERRIDE ME
  }

  /**
   */

  protected didLoad() {
    // OVERRIDE ME
  }

  /**
   */

  protected willInitialize() {
    // OVERRIDE ME
  }

  /**
   */

  protected didInitialize() {
    // OVERRIDE ME
  }
}