import { IObservable } from "./base";
import { IDisposable } from "../object";
import { TypeWrapBus, LimitBus } from "@tandem/common/busses";
import { PropertyChangeAction, Action } from "@tandem/common/actions";

export type propertyChangeCallbackType = (newValue: any, oldValue: any) => void;

export function watchProperty(target: any, property: string, callback: propertyChangeCallbackType) {

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

export function watchPropertyOnce(target: any, property: string, callback: propertyChangeCallbackType) {

  const watcher = watchProperty(target, property, (newValue: any, oldValue: any) => {
    watcher.dispose();
    callback(newValue, oldValue);
  });

  return {
    dispose: () => watcher.dispose(),
    trigger: () => watcher.trigger()
  }
}

export function bindProperty(source: IObservable, sourceProperty: string, target: any, destProperty: string = sourceProperty) {
  return watchProperty(source, sourceProperty, (newValue, oldValue) => {
    target[destProperty] = newValue;
  }).trigger();
}

export function waitForPropertyChange(target: IObservable, property: string, filter: (value) => boolean = () => true) {
  return new Promise((resolve, reject) => {
    const watcher = watchProperty(target, property, (newValue) => {
      if (filter(newValue)) {
        resolve();
        watcher.dispose();
      }
    });
  });
}

export abstract class PropertyWatcher<T extends IObservable> {

  private _watchers: IDisposable[];

  constructor(readonly target: T) {
    this._watchers = [];
  }

  protected addPropertyWatcher(propertyName: string, listener: propertyChangeCallbackType) {
    const watcher = watchProperty(this.target, propertyName, listener)
    this._watchers.push(watcher);
    return {
      dispose: () => {
        const index = this._watchers.indexOf(watcher);
        if (index !== -1) this._watchers.splice(index, 1);
      },
      trigger() {
        watcher.trigger();
        return this;
      }
    }
  }
}