import { Logger } from "saffron-core/src/logger";
import { loggable, bindable } from "saffron-core/src/decorators";
import { ApplicationSingletonFragment } from 'saffron-core/src/fragments';
import { LoadAction, InitializeAction } from "saffron-core/src/actions";

import { IInvoker, IActor } from "saffron-base/src/actors";
import { IApplication } from "saffron-base/src/application";
import { FragmentDictionary } from "saffron-base/src/fragments";

import { ParallelBus, Bus, Response } from "mesh";
import { ApplicationServiceFragment } from "saffron-core/src/fragments";
// import { fragment as consoleLogFragment } from "../services/console-output";

// @observable
@loggable()
export class Application implements IApplication {

  readonly logger: Logger;
  readonly actors:Array<IActor> = [];
  readonly bus: IActor = new ParallelBus(this.actors);
  readonly fragments: FragmentDictionary = new FragmentDictionary();
  private _initializeCalled: boolean = false;

  @bindable()
  public initialized: boolean = false;

  constructor(readonly config: any = {}) {
    this._registerFragments();
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

    this.initialized = true;
  }

  /**
   */

  protected _registerFragments() {
    if (!process.env.TESTING) {
      // this.fragments.register(consoleLogFragment);
    }

    // Make the application available globally through the fragments
    // property so that this reference isn't passed around everywhere.
    this.fragments.register(new ApplicationSingletonFragment(this));
  }

  /**
   */

  private _initializeServices() {

    // Initialize the services (action handlers) of this application.
    this.actors.push(...ApplicationServiceFragment.findAll(this.fragments).map(fragment => fragment.create(this)));
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
