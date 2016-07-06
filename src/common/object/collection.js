import createFactory from 'common/utils/class/create-factory';

function Collection(properties = {}) {
  Object.assign(this, properties);
}

Collection.prototype = [];

Object.assign(Collection.prototype, {

  /**
   * assigns new properties to this collection
   */

  setProperties(properties) {
    Object.assign(this, properties);
  },

  /**
   * pushes items to the end of the array
   */

  push() {
    return this.splice(this.length, 0, ...arguments);
  },

  /**
   * pushes items to the beginning of the array
   */

  unshift() {
    return this.splice(0, 0, ...arguments);
  },

  /**
   * removes an item at the end of the array
   */

  pop() {
    return this.splice(this.length - 1, 1)[0];
  },

  /**
   * removes an item at the beginning of the array
   */

  shift() {
    return this.splice(0, 1)[0];
  },

  /**
   */

  splice(index, length, ...repl) {

    // OVERRIDE ME. All mutations happen here
    return Array.prototype.splice.apply(this, arguments);
  }
});

Collection.create = createFactory(Array);

export default Collection;
