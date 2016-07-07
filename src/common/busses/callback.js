import create from 'common/utils/class/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

export default class CallbackBus {
  constructor(callback) {
    this.callback = callback;
    assertPropertyExists(this, 'callback', Function);
  }

  execute(event) {
    return this.callback(event);
  }

  static create = create;
}
