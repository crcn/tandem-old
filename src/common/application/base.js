import CoreObject from 'common/object';
import Collection from 'common/object/collection';
import observable from 'common/object/mixins/observable';
import { InitializeEvent, LoadEvent } from './events';
import { applicationFragment as loggerFragment } from 'common/logger';
import { ParallelBus } from 'mesh';
import { consoleLogFragment } from 'common/logger/fragments';
import FragmentDictionary from 'common/fragments/dictionary';
import { APPLICATION_NS } from './fragments';

@observable
export default class BaseApplication extends CoreObject {

  constructor(properties) {
    super(properties);

    if (!this.config) {
      this.config = {};
    }

    // the bus is the central communication hub for the rest
    // of the application
    this.busses             = Collection.create();
    this.bus                = ParallelBus.create(this.busses);
    this.fragmentDictionary = FragmentDictionary.create();

    this._registerFragments();
    this._initializeFragments();
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
      loggerFragment,
      consoleLogFragment,
      ...(this.fragments || [])
    );
  }

  /**
   */

  willInitialize() {
    // OVERRIDE ME
  }

  /**
   */

  didInitialize() {
    // OVERRIDE ME
  }

  /**
   */

  _initializeFragments() {
    for (const fragment of this.fragmentDictionary.queryAll(`${APPLICATION_NS}/**`)) {
      fragment.initialize(this);
    }
  }
}
