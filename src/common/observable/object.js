import create from 'common/class/utils/create';

export default class ObservableObject {

  /**
   * @param properties initial properties to define on observable object
   */

  constructor(properties) {
    if (properties != void 0) {
      Object.assign(this, properties);
    }
  }

  /**
   * Sets properties on the observable object, and dispatches a change
   * event if anything is different
   */

  setProperties(properties) {

    var changes = [];
    Object.assign(this, properties);
  }

  static create = create;
}
