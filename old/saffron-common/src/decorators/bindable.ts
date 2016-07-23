// TODO
export default function bindable() {  
  return function(target:any, property:string = undefined, descriptor:PropertyDecorator = undefined) {
   if (property == undefined) {
     bindClass(target);
   } else {
     bindProperty(target, property);
   }
  }

  function bindClass(clazz:{ new():any }) {
    const proto = clazz.prototype;
    for (var key in proto) {
      console.log(proto[key]);
    }
  }

  function bindProperty(proto:any, property:string, descriptor:PropertyDecorator = undefined) {
    var _value;
    Object.defineProperty(proto, property, {
      get() {
        return _value;
      },
      set(value) {
        _value = value;
        console.log(value, this.bus);
      }
    });
  }
}