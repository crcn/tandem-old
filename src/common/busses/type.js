import assertPropertyExists from 'common/utils/assert/property-exists';
import create from 'common/utils/class/create';

export default class TypeBus {

  constructor(type, eventBus) {
    this.type     = type;
    this.bus      = eventBus;
    assertPropertyExists(this, 'type');
    assertPropertyExists(this, 'bus');
  }

  execute(event) {
    if (event.type === this.type) {
      this.bus.execute(event);
    }
  }

  static create = create;
}
