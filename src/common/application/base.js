import CoreObject from 'common/object';
import ObservableDispatcher from 'common/dispatchers/observable';
import observable from 'common/object/mixins/observable';
import { InitializeEvent, LoadEvent } from './events';
import FragmentDictionary from 'common/fragments/dictionary';
import { APPLICATION_NS } from './fragments';

import loggerFragment from './fragments/logger';

@observable
export default class BaseApplication extends CoreObject {

  constructor(properties) {
    super(properties);

    // the bus is the central communication hub for the rest
    // of the application
    this.bus = ObservableDispatcher.create(this);
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
    await this.bus.dispatch(LoadEvent.create());
    await this.bus.dispatch(InitializeEvent.create());
    this.didInitialize();
  }

  /**
   */

  _registerFragments() {
    this.fragmentDictionary.register(
      loggerFragment
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
