import { TypeWrapBus } from "sf-common/busses";
import { IObservable, watchProperty, waitForPropertyChange } from "sf-common/observable";

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { waitForPropertyChange };