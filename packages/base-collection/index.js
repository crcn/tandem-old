import { createFactory } from 'utils-class';

class BaseCollection extends Array {

  constructor(properties) {
    super();
    Object.assign(this, properties);
  }

  setProperties(properties) {
    Object.assign(this, properties);
  }

  static create = createFactory(Array);
}

export default BaseCollection;
