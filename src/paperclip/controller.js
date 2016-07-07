import CoreObject from 'common/object';
import get from 'common/utils/object/get';

export default class Controller extends CoreObject {
  get(key) {
    return get(this, key);
  }

  getProperties(...properties) {
    var ret = {};
    for (var key of properties) {
      ret[key] = this.get(key);
    }
    return ret;
  }
}
