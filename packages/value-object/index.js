import { InvalidError } from 'errors';
import { create } from 'utils-class';
/**
 */

class ValueType {

  /**
   */

  constructor(value) {

    value = this.coerce(value);

    // just like strongly typed stuff. The value in the constructor should not
    // be 'castable' to this type
    if (!this.validate(value)) {
      throw InvalidError.create('invalid');
    }

    this._value = value;
  }

  /**
   * converts value from the constructor into the proper data
   * format. This is seen natively in stuff like String(value.toString())
   * and Date objects.
   */

  coerce(value) {
    return value != void 0 ? value.valueOf() : void 0;
  }

  /**
   */

  validate(value) {
    return true;
  }

  /**
   */

  equals(b) {
    return this.valueOf() === b.valueOf();
  }

  /**
   */

  valueOf() {
    return this._value;
  }

  /**
   */

  toString() {
    return Object.prototype.toString.call(this._value);
  }

  /**
   */

  toJSON() {
    return this._value;
  }

  /**
   */

  static create = create;
}

/**
 */

export default ValueType;
