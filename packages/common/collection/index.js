import { createFactory } from 'common/utils/class';

/**
 * Base collection which is treated like a *native* array
 * @extends Array
 */

class BaseCollection {

  /**
   *
   * @param {Object} properties the initial properties to define on base collection
   * @param {Array} values the initial array values to set into the collection
   */

  constructor(properties, values = []) {
    this.push(...values);
    this.setProperties(properties);
  }

  /**
   * sets properties into the base collection
   * @param properties
   */

  setProperties(properties) {
    Object.assign(this, properties);
  }

  push() {
    return this.splice(this.length, 0, ...arguments);
  }

  unshift() {
    return this.splice(0, 0, ...arguments);
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
    for (var value of values) {
      var i = this.indexOf(value);
      if (~i) this.splice(i, 1);
    }
  }

  /**
   * all mutation methods go through here
   */

  splice() {
    // OVERRIDE ME!
    return Array.prototype.splice.apply(this, arguments);
  }

  /**
   * creates a new collection
   */

  static create = createFactory(Array);
}

// CANNOT extend array. Copy props instead
for (var prop of Object.getOwnPropertyNames(Array.prototype)) {
  if (BaseCollection.prototype[prop]) continue;
  var value = Array.prototype[prop];
  if (typeof value === 'function') BaseCollection.prototype[prop] = value;
}

BaseCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

export default BaseCollection;
