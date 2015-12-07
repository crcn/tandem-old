
/**
 * creates a new factory for creating items
 */

export default function(contextClass) {
  if (!contextClass) contextClass = Object;

  // creates a new object from a class
  function create(arg1, arg2, arg3, arg4) {

    // dirty but fast
    switch(arguments.length) {
      case 1: return new this(arg1);
      case 2: return new this(arg1, arg2);
      case 3: return new this(arg1, arg2, arg3);
      case 4: return new this(arg1, arg2, arg3, arg4);
    }

    // handle edge here.
    // TODO - make this faster.
    return createFromContext.apply(this, arguments);
  }

  // creates an object from *any* native class
  function createFromContext() {
    var context = new contextClass();
    context.__proto__ = this.prototype;
    this.apply(context, arguments);
    return context;
  }

  // context class Object? Use the faster method instead.
  return contextClass === Object ? create : createFromContext;
}
