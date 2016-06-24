import { create } from 'common/utils/class';

class StyleReference {

  constructor(target, property) {
    this.target   = target;
    this.property = property;
  }

  getValue() {
    return this.target.attributes.style[this.property];
  }

  setValue(value) {
    this.target.setStyle({
      [this.property]: value
    });
  }

  static create = create;
}

export default StyleReference;
