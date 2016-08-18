import { TypeWrapBus } from "sf-core/busses";
import { IObservable, watchProperty } from "sf-core/observable";

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitForPropertyChange(target: IObservable, property: string) {
  return new Promise((resolve, reject) => {
    const propertyWatcher = watchProperty(target, property, resolve);
  });
}