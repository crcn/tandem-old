import { IActor } from 'saffron-base/src/actors';
import { Action } from 'saffron-base/src/actions';

import { EmptyResponse, Bus } from 'mesh';

export default class TypeBus implements IActor {

  constructor(readonly type:string, private _bus:Bus) { }

  execute(action:Action) {
    if (event.type === this.type) {
      return this._bus.execute(event);
    }

    return EmptyResponse.create();
  }
}
