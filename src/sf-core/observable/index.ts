import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";

export interface IObservable {
  observe(actor: IActor);
  unobserve(actor: IActor);
  notify(action: Action);
}

export class Observable implements IObservable {
  private _observers: any;
  constructor(private _target?: IObservable) {
    if (!this._target) {
      this._target = this;
    }
  }

  observe(actor: IActor) {
    if (!this._observers) {
      this._observers = actor;
    } else if (!Array.isArray(this._observers)) {
      this._observers = [this._observers, actor];
    } else {
      this._observers.push(actor);
    }
  }

  unobserve(actor: IActor) {
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

  public notify(action: Action) {
    if (action.canPropagate === false) return;
    action.currentTarget = this._target;
    if (!this._observers) return;
    if (!Array.isArray(this._observers)) return this._observers.execute(action);
    for (const observer of this._observers) {
      if (action.canPropagateImmediately === false) break;
      observer.execute(action);
    }
  }
}
