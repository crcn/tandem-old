import { create } from 'common/utils/class';

/**
 */

class BaseObject {

  constructor(properties) {
    if (properties != void 0) {
      Object.assign(this, properties);
    }
  }

  static create = create;
}

export default BaseObject;
