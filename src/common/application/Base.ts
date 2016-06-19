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

  constructor(properties = {}, fragments:Array<IFragment>) {
    super(properties);

    this._fragments   = FragmentDictionary.create(fragments); 
    this._dispatchers = DispatcherCollection.create();    
  }

  /**
   */

  public get fragments():FragmentDictionary {
    return this._fragments;
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

  public initialize():void {

    this._initializeFragments();

    // first signal that the application is loading
    // TODO: add async/await stuff here
    this._dispatchers.dispatch(LoadEvent.create(this));

    // after loading, signal that everything should initialize
    this._dispatchers.dispatch(InitializeEvent.create(this));
  }

  /**
   */

  private _initializeFragments():void {
    for (var fragment of this._fragments.query('application')) {
      fragment.create({ application: this });
    }
  }
}

export default BaseApplication;
