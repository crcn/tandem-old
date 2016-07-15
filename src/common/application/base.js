import CoreObject from 'common/object';
import Collection from 'common/object/collection';
import observable from 'common/object/mixins/observable';
import { InitializeEvent, LoadEvent } from './events';
import { applicationFragment as loggerFragment } from 'common/logger';
import { ParallelBus } from 'mesh';
import { consoleLogFragment } from 'common/logger/services';
import FragmentDictionary from 'common/fragments/dictionary';
import Logger from 'common/logger';
import loggable from 'common/logger/mixins/loggable';

@observable
@loggable
export default class BaseApplication extends CoreObject {

  constructor(properties) {
    super(properties);

    // the configuration of the application
    // which can by used by other fragments
    if (!this.config) {
      this.config = {};
    }

    // contains most dependencies for the application.
    this.fragmentDictionary = FragmentDictionary.create();

    // acts on events dispatched by the central bus
    this.actors = Collection.create();

    // the central bus which dispatches all actions & events
    // to all actors of the applicaton
    this.bus = ParallelBus.create(this.actors);

    // register all parts of the application here
    this._registerFragments();
    this._initializeActors();
  }

  /**
   * initializes the application
   */

  async initialize() {

    if (this._initialized) {
      throw new Error('Cannot initialize application twice.');
    }

    this._initialized = true;

    this.willInitialize();
    await this.bus.execute(LoadEvent.create());
    await this.bus.execute(InitializeEvent.create());
    this.didInitialize();
  }

  /**
   */

  _registerFragments() {
    this.fragmentDictionary.register(
      consoleLogFragment,
      ...(this.fragments || [])
    );
  }

  /**
   */

  _initializeActors() {
    this.actors.push(...this.fragmentDictionary.queryAll('application/actors/**').map((fragment) => (
      fragment.create({
        app    : this,
        bus    : this.bus,
        config : this.config
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
