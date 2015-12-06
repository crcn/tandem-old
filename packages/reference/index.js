import { create } from 'utils-class';

class Reference {

  constructor(target, property, coerce) {
    this.target    = target;
    this.property  = property;
    this.coerce    = typeof coerce === 'function' ? coerce : function(value) {
      return value == void 0 ? coerce : value;
    };
  }

  getValue() {
    return this.coerce(this.target[this.property]);
  }

  setValue(value) {
    this.target.setProperties({
      [this.property]: this.coerce(value)
    });
  }

  static create = create;
}

export default Reference;
