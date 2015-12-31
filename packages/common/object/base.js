import { create, extend } from 'common/utils/class';

class BaseObject {
  constructor(properties) {
    this.setProperties(properties);
  }
  setProperties(properties) {
    Object.assign(this, properties);
  }

  static create = create;
}

export default BaseObject;
