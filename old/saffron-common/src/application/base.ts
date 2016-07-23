import Logger from '../logger/index';
import loggable from '../decorators/loggable';
import observable from '../decorators/observable';
import Collection from '../object/collection';
import CoreObject from '../object/index';
import FragmentCollection from '../fragments/collection';

import IApplication from './interface';
import { IActor } from '../actors/index';
import { ParallelBus, Bus, Response } from 'mesh';
import { ApplicationServiceFragment } from '../fragments/index';
import { LoadAction, InitializeAction } from '../actions/index';
import { fragment as consoleLogFragment } from '../services/console-output';

@observable
@loggable
export default class BaseApplication extends CoreObject implements IApplication {

  readonly bus:IActor;
  readonly logger:Logger;
  readonly actors:Array<IActor>;
  readonly fragments:FragmentCollection;
  private _initialized:boolean;

  constructor(readonly config:any = {}) {
    super({});

    // contains most dependencies for the application.
    this.fragments = new FragmentCollection();

    // acts on events dispatched by the central bus
    this.actors = new Collection<any>();

    // the central bus which dispatches all actions & events
    // to all actors of the applicaton
    this.bus = ParallelBus.create(this.actors);

    // register all parts of the application here
    this._registerFragments();
  }

  async initialize() {

    if (this._initialized) {
      throw new Error('Cannot initialize application twice.');
    }

    this._initialized = true;
    this._initializeActors();

    this.willInitialize();
    this.setProperties({ loading: true });
    await this.bus.execute(new LoadAction());
    await this.bus.execute(new InitializeAction());
    this.setProperties({ loading: false });
    this.didInitialize(); 
  }

  /**
   */

  protected _registerFragments() {
    if (!process.env.TESTING) {
      this.fragments.register(consoleLogFragment);
    }
  }

  /**
   */

  _initializeActors() {
    this.actors.push(...this.fragments.queryAll<ApplicationServiceFragment>('application/services/**').map((fragment:ApplicationServiceFragment) => (
      fragment.create(this)
    )));
  }

  /**
   */

  willInitialize() {
    // OVERRIDE ME
  }

  /**
   */

  didInitialize() {
    this.logger.info('initialized');
  }
}
