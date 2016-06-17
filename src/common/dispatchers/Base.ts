import create from 'common/utils/class/create';
import IEvent from 'common/events/IEvent';
import IDispatcher from './IDispatcher';

abstract class BaseDispatcher implements IDispatcher {
  public abstract dispatch(event:IEvent):any;
  static create = create;
}

export default BaseDispatcher;