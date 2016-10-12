import { IObservable } from "./base";
import { PropertyChangeAction, Action } from "@tandem/common/actions";
import { TypeWrapBus, LimitBus } from "@tandem/common/busses";

export function watchProperty(target: any, property: string, callback: (newValue: any, oldValue: any) => void) {

  const observer = {
    execute(action: Action) {
      if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
        const propertyAction = <PropertyChangeAction>action;
        if (propertyAction.property === property && propertyAction.target === target) {
          callback(propertyAction.newValue, propertyAction.oldValue);
        }
      }
    }
  };

  if (target.observe) {
    (<IObservable>target).observe(observer);
  }

  const ret = {
    dispose: () => {
      if (target.unobserve) target.unobserve(observer);
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