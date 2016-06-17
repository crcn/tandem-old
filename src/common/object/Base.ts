import { create } from 'common/utils/class/index';
import assign from 'common/utils/object/assign';

/**
 */

class BaseObject {

  constructor(properties) {
    if (properties != void 0) {
      assign(this, properties);
    }
  }

  static create = create;
}

export default BaseObject;
