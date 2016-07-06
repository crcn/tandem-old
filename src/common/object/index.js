import create from 'common/utils/class/create';

export default class CoreObject {

  constructor(properties) {
    if (properties != void 0) {
      Object.assign(this, properties);
    }
  }

  setProperties(properties) {
    Object.assign(this, properties);
  }

  static create = create;
}
