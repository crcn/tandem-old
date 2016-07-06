import create from 'common/utils/class/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

export default class CallbackDispatcher {
  constructor(callback) {
    this.callback = callback;
    assertPropertyExists(this, 'callback');
  }

  dispatch(event) {
    this.callback(event);
  }

  static create = create;
}
