import IEvent from './IEvent';
import create from 'common/utils/class/create';

class Event implements IEvent {

  private _type:String;
  private _target:any;
  private _canPropagate:boolean = true;

  constructor(type:String, target:any = void 0) {
    this._type   = type;
    this._target = target;
  }

  get type():String {
    return this._type;
  }

  get target():any {
    return this._target;
  }

  public stopPropagation():void {
    this._canPropagate = false;
  }

  public canPropagate():boolean {
    return this._canPropagate;
  }

  public stopImmediatePropagation():void {
    throw new Error('to implement');
  }

  static create = create;
}

export default Event;