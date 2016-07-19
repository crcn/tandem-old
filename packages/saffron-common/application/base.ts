import CoreObject from '../object/index';
import Collection from '../object/collection';
import observable from '../object/mixins/observable';
import { InitializeEvent, LoadEvent } from './events/index';
import { ParallelBus, Bus, Response } from 'mesh';
import { fragment as consoleLogFragment } from '../logger/services/console-output';
import FragmentCollection from '../fragments/collection';
import Logger from '../logger/index';
import loggable from '../logger/mixins/loggable';
 
@observable
@loggable
export default class BaseApplication extends CoreObject {

  public config:any;
  public fragments:FragmentCollection;
  public actors:Array<any>;
  public bus:Bus;
  private _initialized:boolean;
  public logger:Logger;

  constructor(properties) {
    super(properties);

    // the configuration of the application
    // which can by used by other fragments
    if (!this.config) {
      this.config = {};
    }
  
    const initialFragments = this.fragments || [];

    // contains most dependencies for the application.
    this.fragments = FragmentCollection.create();
    this.fragments.register(...initialFragments);

    // acts on events dispatched by the central bus
    this.actors = Collection.create<any>();

    // the central bus which dispatches all actions & events
    // to all actors of the applicaton
    this.bus = ParallelBus.create(this.actors);

    // register all parts of the application here
    this._registerFragments();
  }

  /**
   * initializes the application
   */

  async initialize() {

    if (this._initialized) {
      throw new Error('Cannot initialize application twice.');
    }

    this._initialized = true;
    this._initializeActors();

    this.willInitialize();
    this.setProperties({ loading: true });
    await this.bus.execute(LoadEvent.create());
    await this.bus.execute(InitializeEvent.create());
    this.setProperties({ loading: false });
    this.didInitialize();
  }

  /**
   */

  _registerFragments() {
    if (!process.env.TESTING) {
      this.fragments.register(consoleLogFragment);
    }
  }

  /**
   */

  _initializeActors() {
    this.actors.push(...this.fragments.queryAll('application/services/**').map((fragment) => (
      fragment.create({
        app    : this,
        bus    : this.bus,
        config : this.config,
      })
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
