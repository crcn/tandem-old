import { create, extend } from 'common/utils/class';

/**
 * Base object with a common interface
 */

class BaseObject {

  /**
   * constructor
   * @param {Object} properties properties to assign to the object
   */

  constructor(properties) {
    this.setProperties(properties);
  }

  /**
   * Sets properties on the object
   * @param properties
   */

  setProperties(properties) {
    Object.assign(this, properties);
  }

  /**
   * Creates a new BaseObject
   */

  static create = create;
}

export default BaseObject;
