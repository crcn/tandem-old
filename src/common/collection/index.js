import { createFactory } from 'common/utils/class';

/**
 * Base collection which is treated like a *native* array
 * @extends Array
 */

function Collection(properties) {
  if (properties != void 0) {
    this.setProperties(properties);
  }
}

Collection.prototype = [];

Object.assign(Collection.prototype, {

  /**
   * sets properties into the base collection
   * @param properties
   */

  setProperties(properties) {
    Object.assign(this, properties);
  },

  push() {
    return this.splice(this.length, 0, ...arguments);
  },

  unshift() {
    return this.splice(0, 0, ...arguments);
  },

  shift() {
    return this.splice(0, 1);
  },

  pop() {
    return this.splice(this.length - 1, 1);
  },

  /**
   * removes an value from the collection if it exists
   * @param values
   */

  remove(...values) {
    for (const value of values) {
      const i = this.indexOf(value);
      if (~i) this.splice(i, 1);
    }
  },

  /**
   * es6 includes() method
   */

  includes(value) {
    return this.indexOf(value) > -1;
  },

  /**
   * all mutation methods go through here
   */

  splice() {
    // OVERRIDE ME!
    return Array.prototype.splice.apply(this, arguments);
  },
});

Collection.create = createFactory(Array);

// CANNOT extend array. Copy props instead
for (const prop of Object.getOwnPropertyNames(Array.prototype)) {
  if (Collection.prototype[prop]) continue;
  const value = Array.prototype[prop];
  if (typeof value === 'function') Collection.prototype[prop] = value;
}

Collection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

export default Collection;
