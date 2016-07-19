import { create } from 'saffron-common/lib/utils/class/index';

class BaseGuide {

  snap(left, top) {
    return { left, top };
  }

  intersects() {
    return false;
  }

  static create = create;
}

export default BaseGuide;
