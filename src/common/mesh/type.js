import create from 'common/utils/class/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

import { EmptyResponse } from 'mesh';

export default class TypeBus {

  constructor(type, eventBus) {
    this.type     = type;
    this.bus      = eventBus;
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
