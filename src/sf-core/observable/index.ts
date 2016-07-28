import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";

export interface IObservable {
  observe(actor: IActor);
}

export class Observable implements IObservable {
  private _observers: any;
  constructor() { }

  observe(actor: IActor) {
    if (!this._observers) {
      this._observers = actor;
    } else if (!Array.isArray(this._observers)) {
      this._observers = [this._observers, actor];
    } else {
      this._observers.push(actor);
    }
  }

  public notify(action: Action) {
    if (action.canPropagate === false) return;
    action.currentTarget = this;
    if (!this._observers) return;
    if (!Array.isArray(this._observers)) return this._observers.execute(action);
    for (const observer of this._observers) {
      if (action.canPropagateImmediately === false) break;
      observer.execute(action);
    }
  }
}
