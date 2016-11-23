import { Action } from "@tandem/common/messages";
import { IObservable } from "./base";
import { IDispatcher } from "@tandem/mesh";

export { IObservable };

// TODO - change "notify" to "dispatch"
export class Observable implements IObservable {
  private _observers: any;
  constructor(private _target?: IObservable) {
    if (!this._target) {
      this._target = this;
    }
  }

  observe(...dispatchers: IDispatcher<any, any>[]) {
    for (let i = 0, n = dispatchers.length; i < n; i++) {
      const actor = dispatchers[i];
      if (!actor && !actor.dispatch) {
        throw new Error(`Attempting to add a non-observable object.`);
      }

      if (!this._observers) {
        this._observers = actor;
      } else if (!Array.isArray(this._observers)) {
        this._observers = [actor, this._observers];
      } else {
        this._observers.unshift(actor);
      }
    }
  }

  unobserve(...dispatchers: IDispatcher<any, any>[]) {
    for (let i = 0, n = dispatchers.length; i < n; i++) {
      const actor = dispatchers[i];
      if (this._observers === actor) {
        this._observers = null;
      } else if (Array.isArray(this._observers)) {
        const i = this._observers.indexOf(actor);
        if (i !== -1) {
          this._observers.splice(i, 1);
        }

        // only one left? Move to a more optimal method for notifying
        // observers.
        if (this._observers.length === 1) {
          this._observers = this._observers[0];
        }
      }
    }
  }

  public notify(action: Action) {
    if (action.canPropagate === false) return;
    if (action.target && action.bubbles === false) return;
    action.currentTarget = this._target;
    if (!this._observers) return;
    if (!Array.isArray(this._observers)) return this._observers.dispatch(action);

    // fix case where observable unlistens and re-listens to events during a notifiction
    const observers = this._observers.concat();
    for (let i = observers.length; i--; ) {
      if (action.canPropagateImmediately === false) break;
      observers[i].dispatch(action);
    }
  }
}


export * from "./watch-property";
export * from "./collection";