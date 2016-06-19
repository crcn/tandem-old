import IEvent from 'common/events/IEvent';
import IDispatcher from './IDispatcher';

export default class TypeDispatcher implements IDispatcher {

  private _type:string;
  private _dispatcher:IDispatcher;

  constructor(type:string, dispatcher:IDispatcher) {
    this._type       = type;
    this._dispatcher = dispatcher;
  }

  public dispatch(event:IEvent) {
    if (event.type !== this._type) return;
    return this._dispatcher.dispatch(event);
  }

  static create(type:string, dispatcher:IDispatcher) {
    return new TypeDispatcher(type, dispatcher);
  }
}