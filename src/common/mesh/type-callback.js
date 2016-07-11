import create from 'common/utils/class/create';
import { WrapBus, EmptyResponse } from 'mesh';
import assertPropertyExists from 'common/utils/assert/property-exists';

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
