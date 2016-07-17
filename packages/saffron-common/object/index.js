import create from '../utils/class/create';

var _id = 1;

export default class CoreObject {

  constructor(properties) {
    this.id = _id++;
    if (properties != void 0) {
      Object.assign(this, properties);
    }
  }

  setProperties(properties) {
    Object.assign(this, properties);
  }

  static create = create;
}
