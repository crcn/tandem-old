import { IObservable } from "./base";
import { PropertyChangeAction } from "tandem-common/actions";
import { TypeWrapBus, LimitBus } from "tandem-common/busses";

export function watchProperty(target: IObservable, property: string, callback: (newValue: any, oldValue: any) => void) {

  const observer = new LimitBus(1, new TypeWrapBus(PropertyChangeAction.PROPERTY_CHANGE, (action: PropertyChangeAction) => {
    if (action.property === property && action.target === target) {
      callback(action.newValue, action.oldValue);
    }
  }));

  target.observe(observer);

  const ret = {
    dispose: () => {
      target.unobserve(observer);
    },
    trigger: () => {
      if (target[property] != null) {
        callback(target[property], undefined);
      }
      return ret;
    }
  };

  return ret;
}

export function bindProperty(source: IObservable, sourceProperty: string, target: any, destProperty: string = sourceProperty) {
  return watchProperty(source, sourceProperty, (newValue, oldValue) => {
    target[destProperty] = newValue;
  }).trigger();
}

export function waitForPropertyChange(target: IObservable, property: string) {
  return new Promise((resolve, reject) => {
    const propertyWatcher = watchProperty(target, property, resolve);
  });
}