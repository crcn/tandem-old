import { TypeWrapBus } from "sf-core/busses";
import { IObservable, watchProperty, waitForPropertyChange } from "sf-core/observable";

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { waitForPropertyChange };