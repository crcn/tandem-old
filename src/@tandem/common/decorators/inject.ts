import { Provider, IProvider, Injector, IInjectable } from "../ioc";

/**
 * inject decorator for properties of classes that live in a Injector object
 */

export function inject(id?: string, map: (dependency: IProvider) => any = undefined) {
  return function(target: any, property: any, index: any = undefined) {
    const key = typeof target === "function" ? index : property;
    const inject = Object.assign({}, Reflect.getMetadata("injectProperties", target) || {});
    inject[key] = [id || property, map || (dependency => dependency.value)];
    Reflect.defineMetadata("injectProperties", inject, target)
  }
}

type injectableType = { new(...rest: any[]): Provider<any> }
