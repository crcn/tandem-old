import IDispatcher from './IDispatcher';
import IEvent from 'common/events/IEvent';

class CallbackDispatcher implements IDispatcher {

  private _callback:Function;

  constructor(callback:Function) {
    this._callback = callback;
  }

  public dispatch(event:IEvent):any {
    return this._callback(event);
  }

  static create(callback:Function) {
    return new CallbackDispatcher(callback);
  }
}

export default CallbackDispatcher;