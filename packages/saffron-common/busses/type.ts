import create from '../utils/class/create';
import assertPropertyExists from '../utils/assert/property-exists';

import { EmptyResponse, Bus } from 'mesh';

export default class TypeBus {

  constructor(public type:string, public bus:Bus) {
    assertPropertyExists(this, 'type');
    assertPropertyExists(this, 'bus');
  }

  execute(event) {
    if (event.type === this.type) {
      return this.bus.execute(event);
    }

    return EmptyResponse.create();
  }

  static create = create;
}
