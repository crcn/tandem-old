import { IActor } from 'sf-core/actors';
import { Action } from 'sf-core/actions';

export class Observable {
  private _observers: any;
  constructor() { }

  observe(actor:IActor) {
    if (!this._observers) {
      this._observers = actor;
    } else if (!Array.isArray(this._observers)) {
      this._observers = [this._observers, actor];
    } else {
      this._observers.push(actor);
    }
  }

  public notifyObservers(action:Action) {
    if (!this._observers) return;
    if (!Array.isArray(this._observers)) return this._observers.execute(action);
    for (const observer of this._observers) {
      observer.execute(action);
    }
  }
}