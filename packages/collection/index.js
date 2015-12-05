import { createFactory } from 'utils-class';

class BaseCollection {

  constructor(properties) {
    this.setProperties(properties);
  }

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

  remove(...values) {
    for (var value of values) {
      var i = this.indexOf(value);
      if (~i) this.splice(i, 1);
    }
  }

  splice() {
    // OVERRIDE ME!
    return Array.prototype.splice.apply(this, arguments);
  }

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
