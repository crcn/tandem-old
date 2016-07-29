import { Dependency, Dependencies } from "../dependencies";

export interface IInjectable {
  didInject():void;
}

/**
 * injects properties
 */

export class Injector {

  /**
   * Injects dependencies into the target injectable
   */

  static inject(target: any, dependencies: Dependencies) {
    const __inject = target['__inject'];

    if (__inject) {
      for (const property in __inject) {
        const ns = __inject[property];
        const dependency = dependencies.query<Dependency<any>>(ns);
        if (dependency) {

          // TODO - check for dependency.getInjectableValue()
          target[property] = dependency.value;
        } else if (!process.env.TESTING) {
          console.warn(`Cannot inject ${ns} into ${target.constructor.name}.${property} property.`);
        }
      }
      target.didInject();
    }

    return target;
  }
}

/**
 * inject decorator for properties of classes that live in a Dependencies object
 */

export default function inject(ns: string) {
  return function(target: IInjectable, property: string, descriptor: PropertyDecorator = undefined) {
    let inject = {};

    if (!(inject = target["__inject"])) {
      inject = target["__inject"] = {};
    }

    inject[property] = ns;
  };
}
