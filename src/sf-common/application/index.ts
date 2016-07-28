import { Logger } from "sf-core/logger";
import { loggable, bindable } from "sf-core/decorators";
import { ApplicationServiceFragment } from "sf-core/fragments";
import { ApplicationSingletonFragment } from "sf-core/fragments";
import { LoadAction, InitializeAction } from "sf-core/actions";
import { fragment as consoleLogServiceFragment } from "../services/console-output";

import { IActor } from "sf-core/actors";
import { IApplication } from "sf-core/application";
import { FragmentDictionary } from "sf-core/fragments";

import { ParallelBus } from "mesh";

// @observable
@loggable()
export class Application implements IApplication {

  readonly logger: Logger;
  readonly actors: Array<IActor> = [];
  readonly bus: IActor = new ParallelBus(this.actors);
  readonly fragments: FragmentDictionary = new FragmentDictionary();
  private _initializeCalled: boolean = false;

  constructor(readonly config: any = {}) {
    this.registerFragments();
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

  protected registerFragments() {
    if (!process.env.TESTING) {
      this.fragments.register(consoleLogServiceFragment);
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
