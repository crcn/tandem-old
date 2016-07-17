import create from '../utils/class/create';
import assertPropertyExists from '../utils/assert/property-exists';

import { WrapBus, EmptyResponse } from 'mesh';

export default class TypeCallbackBus {

  constructor(type, callback) {
    this.type     = type;
    this.bus      = WrapBus.create(callback);
    assertPropertyExists(this, 'type');
  }

  execute(event) {
    if (event.type === this.type) {
      return this.bus.execute(event);
    }
    return EmptyResponse.create();
  }

  static create = create;
}
