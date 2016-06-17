import IEvent from 'common/events/IEvent';
import Collection from 'common/collection/Collection';
import IDispatcher from './IDispatcher';

class DispatcherCollection extends Collection implements IDispatcher {
  dispatch(event:IEvent):any {
    for (const dispatcher of this) {
      dispatcher.dispatch(event);
    }
  }
} 

export default DispatcherCollection;