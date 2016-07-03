import create from 'common/class/utils/create';
import assertPropertyExists from 'common/utils/assert/property-exists';

export default class TypeDispatcher {
  constructor(type, dispatcher) {
    this.type       = type;
    this.dispatcher = dispatcher;
    assertPropertyExists(this, 'type');
    assertPropertyExists(this, 'dispatcher');
  }

  dispatch(event) {
    if (event.type === this.type) {
      return this.dispatcher.dispatch(event);
    }
  }

  static create = create;
}
