import { create } from 'saffron-common/utils/class';

class AttributeReference {
  constructor(target, property) {
    this.target = target;
    this.property = property;
  }
  getValue() {
    return this.target.attributes[this.property];
  }
  setValue(value) {
    this.target.setAttribute(this.property, value);
  }

  static create = create;
}

export default AttributeReference;