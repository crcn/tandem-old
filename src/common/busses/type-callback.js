import create from 'common/utils/class/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

export default class TypeCallbackBus {

  constructor(type, callback) {
    this.type     = type;
    this.callback = callback;
    assertPropertyExists(this, 'type');
    assertPropertyExists(this, 'callback');
  }

  execute(event) {
    if (event.type === this.type) {
      this.callback(event);
    }
  }

  static create = create;
}
