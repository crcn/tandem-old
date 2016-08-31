export function mixin(...baseCtors: Array<any>) {
  return function(derivedCtor: any) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        if (name !== "constructor" && !derivedCtor.prototype.hasOwnProperty(name)) {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
      });
    });
  };
}