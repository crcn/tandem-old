
export default function(...args) {
  var object = Object.create(this.prototype);
  this.apply(object, args);
  return object;
};
