import { create } from 'common/utils/class/index';
import IDispatcher from 'common/dispatchers/idispatcher';
import DispatcherCollection from 'common/dispatchers/collection';
import IEvent from 'common/events/IEvent';
import assign from 'common/utils/object/assign';

/**
 */

class ObservableObject {

  private _observers:DispatcherCollection;

  constructor(properties) {
    if (properties != void 0) {
      assign(this, properties);
    }
  }

  setProperties(properties:any) {
    
  }

  static create(properties) {
    return new ObservableObject(properties);
  }
}

export default ObservableObject;
