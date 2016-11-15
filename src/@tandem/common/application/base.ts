import { SequenceBus } from "@tandem/mesh";
import { IBus } from "@tandem/mesh";
import { IBrokerBus, BrokerBus } from "@tandem/common/dispatchers";
import { LoadAction, InitializeAction } from "../actions";
import {
  Provider,
  Injector,
  PrivateBusProvider,
} from '../ioc';

/**
 */

export class Application {

  protected bus: IBus;
  private _initialized: boolean;

  constructor(readonly injector: Injector) {
    this.bus = PrivateBusProvider.getInstance(injector);
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

    // Prepare the application for initialization. Injector that
    // need to be loaded before being used by other injector should listen on this action
    // here.
    await this.bus.dispatch(new LoadAction());

    this.didLoad();
    this.willInitialize();

    // Notify the application that everything is ready
    await this.bus.dispatch(new InitializeAction());

    this.didInitialize();
  }

  /**
   */

  protected willLoad() {
    // OVRRIDE ME
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