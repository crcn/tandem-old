import { Dependency, IDependency, Dependencies, IInjectable } from "../dependencies";


/**
 * inject decorator for properties of classes that live in a Dependencies object
 */

export default function inject(ns: string, map:(dependency:IDependency) => any = undefined) {
  return function(target: IInjectable, property: string, descriptor: PropertyDecorator = undefined) {
    let inject = {};

    if (!(inject = target["__inject"])) {
      inject = target["__inject"] = {};
    }

    inject[property] = [ns, map || (dependency => dependency.value)];
  };
}
