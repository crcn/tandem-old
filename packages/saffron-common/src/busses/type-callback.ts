import { IActor } from 'saffron-base/src/actors';
import { Action } from 'saffron-base/src/actions';
import { WrapBus, EmptyResponse } from 'mesh';

export default class TypeCallbackBus implements IActor {

  private _bus:WrapBus;

  constructor(readonly type:string, callback:Function) {
    this.type = type;
    this._bus = WrapBus.create(callback as any);
  }

  execute(action:Action) {
    if (action.type === this.type) {
      return this._bus.execute(event);
    }
    return EmptyResponse.create();
  }
}
