import BaseDispatcher from './Base';
import IEvent from 'common/events/IEvent';

class CallbackDispatcher extends BaseDispatcher {

  private _callback:Function;

  constructor(callback:Function) {
    super();
    this._callback = callback;
  }

  public dispatch(event:IEvent):any {
    return this._callback(event);
  }
}

export default CallbackDispatcher;