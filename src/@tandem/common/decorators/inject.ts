import { Dependency, IDependency, Dependencies, IInjectable } from "../dependencies";


/**
 * inject decorator for properties of classes that live in a Dependencies object
 */

// deprecated
export function inject(id?: string, map: (dependency: IDependency) => any = undefined) {
  return function(target: any, property: any, index: any = undefined) {
    const key = typeof target === "function" ? index : property;
    const inject = Reflect.getMetadata("injectProperties", target) || {};
    inject[key] = [id || property, map || (dependency => dependency.value)];
    Reflect.defineMetadata("injectProperties", inject, target)
  }
}

type injectableType = { new(...rest: any[]): Dependency<any> }

export function inject2(id: string, map: (dependency: IDependency) => any = undefined) {
  return function(target: IInjectable, property: string, index:number = undefined) {

    console.log(id, arguments, index);
  };
}
