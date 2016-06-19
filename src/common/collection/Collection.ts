import createFactory from 'common/utils/class/createFactory';
import assign from 'common/utils/object/assign';

/**
 * Base collection which is treated like a *native* array
 * @extends Array
 */

class Collection extends Array {

  /**
   */

  constructor(properties = undefined) {
    super();
    if (properties != void 0 && typeof properties === 'object') {
      if (properties instanceof Array) {
        this.push(...properties);
      } else {
        this.setProperties(properties);
      }
    }
  }

  /**
   */

  concat(...args) {
    return (Object)(this.constructor).create([].concat(this).concat(...args));
  }

  /**
   * sets properties into the base collection
   * @param properties
   */

  setProperties(properties) {
    assign(this, properties);
  }

  push(...args) {
    return this.splice(this.length, 0, ...args);
  }

  unshift(...args) {
    return this.splice(0, 0, ...args);
  }

  shift() {
    return this.splice(0, 1);
  }

  pop() {
    return this.splice(this.length - 1, 1);
  }

  /**
   * removes an value from the collection if it exists
   * @param values
   */

  remove(...values) {
    for (const value of values) {
      const i = this.indexOf(value);
      if (~i) this.splice(i, 1);
    }
  }

  /**
   * es6 includes() method
   */

  includes(value) {
    return this.indexOf(value) > -1;
  }

  /**
   * all mutation methods go through here
   */

  splice(...args) {
    return Array.prototype.splice.apply(this, args);
  }

  static create =  createFactory(Array);
}

export default Collection;
