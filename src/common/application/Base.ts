import BaseObject from 'common/object/Base';
import IFragment from 'common/fragments/IFragment';
import FragmentDictionary from 'common/fragments/dictionary';
import DispatcherCollection from 'common/dispatchers/Collection';
import { LoadEvent, InitializeEvent } from 'common/events/types';

/**
 * Main entry point for all applications 
 */

abstract class BaseApplication extends BaseObject {

  /**
   * the central event dispatcher that allows modules to commmunicate
   * with each other
   */

  private _dispatchers:DispatcherCollection;
  private _fragments:FragmentDictionary;

  /**
   */

  constructor(properties = {}) {
    super(properties);

    this._fragments   = FragmentDictionary.create(this._createFragments()); 
    this._dispatchers = DispatcherCollection.create();    
  }

  /**
   * the main dispatcher needs to be public so that other modules can
   * communicate with each other.
   */

  public get dispatcher():DispatcherCollection {
    return this._dispatchers;
  }

  /**
   * initializes the application
   */

  public initialize() {

    // first signal that the application is loading
    // TODO: add async/await stuff here
    this._dispatchers.dispatch(LoadEvent.create(this));

    // after loading, signal that everything should initialize
    this._dispatchers.dispatch(InitializeEvent.create(this));
  }

  /**
   */

  protected abstract _createFragments():Array<IFragment>;
}

export default BaseApplication;
