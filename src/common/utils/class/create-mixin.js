
/**
 * http://raganwald.com/2015/06/26/decorators-in-es7.html
 */

export default (behaviour, sharedBehaviour = {}) => {

  const instanceKeys = global.Reflect.ownKeys(behaviour);
  const sharedKeys   = global.Reflect.ownKeys(sharedBehaviour);
  const typeTag      = Symbol('isa');

  function _mixin(clazz) {

    if (~instanceKeys.indexOf('constructor')) {
      class ctor extends clazz {
        constructor(...rest) {
          super(...rest);
          behaviour.constructor.call(this, ...rest);
        }
      }

      clazz = ctor;
    }

    for (const property of instanceKeys) {
      if (clazz.prototype[property] != void 0) continue;
      Object.defineProperty(clazz.prototype, property, {
        value: behaviour[property],
        writable: true,
      });
    }

    Object.defineProperty(clazz.prototype, typeTag, { value: true });

    return clazz;
  }

  for (const property of sharedKeys) {
    Object.defineProperty(_mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property),
    });
  }

  Object.defineProperty(_mixin, Symbol.hasInstance, {
    value: (i) => !!i[typeTag],
  });

  return _mixin;
};
