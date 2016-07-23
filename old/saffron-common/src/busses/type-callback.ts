import assertPropertyExists from '../utils/assert/property-exists';

import { WrapBus, EmptyResponse } from 'mesh';

export default class TypeCallbackBus {

  public type:string;
  public bus:WrapBus;

  constructor(type:string, callback:Function) {
    this.type     = type;
    this.bus      = WrapBus.create(callback as any);
    assertPropertyExists(this, 'type');
  }

  execute(action) {
    if (action.type === this.type) {
      return this.bus.execute(event);
    }
    return EmptyResponse.create();
  }
}
