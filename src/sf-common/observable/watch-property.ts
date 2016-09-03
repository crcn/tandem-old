import { PropertyChangeAction, PROPERTY_CHANGE } from "sf-common/actions";
import { IObservable } from "./base";
import { TypeWrapBus, LimitBus } from "sf-common/busses";

export function watchProperty(target: IObservable, property: string, callback: (newValue: any, oldValue: any) => void) {

  const observer = new LimitBus(1, new TypeWrapBus(PROPERTY_CHANGE, (action: PropertyChangeAction) => {
    if (action.property === property) {
      callback(action.newValue, action.oldValue);
    }
  }));

  target.observe(observer);

  return {
    dispose: () => {
      target.unobserve(observer);
    },
    trigger: () => {
      if (target[property] != null) {
        callback(target[property], undefined);
      }
    }
  };
}

export function waitForPropertyChange(target: IObservable, property: string) {
  return new Promise((resolve, reject) => {
    const propertyWatcher = watchProperty(target, property, resolve);
  });
}