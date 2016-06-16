
/**
 * creates a new factory for creating items
 */

export default (contextClass:any = Object) => {

  // creates an object from *any* native class
  function createFromContext() {
    var context:any = new contextClass();
    context.__proto__ = this.prototype;
    this.apply(context, arguments);
    return context;
  }

  // creates a new object from a class
  function create(...args) {

    // dirty but fast
    switch (args.length) {
      case 1  : return new this(args[0]);
      case 2  : return new this(args[0], args[1]);
      case 3  : return new this(args[0], args[1], args[2]);
      case 4  : return new this(args[0], args[1], args[2], args[3]);
      default : return createFromContext.apply(this, args);
    }
  }

  // context class Object? Use the faster method instead.
  return contextClass === Object ? create : createFromContext;
};
