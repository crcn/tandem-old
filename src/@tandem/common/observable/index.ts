import { IActor } from "@tandem/common/actors";
import { Action } from "@tandem/common/actions";
import { IObservable } from "./base";

export { IObservable };

export class Observable implements IObservable {
  private _observers: any;
  constructor(private _target?: IObservable) {
    if (!this._target) {
      this._target = this;
    }
  }

  observe(...actors: Array<IActor>) {
    for (const actor of actors) {
      if (!actor) {
        throw new Error(`Cannot add undefined observer`);
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

  unobserve(...actors: Array<IActor>) {
    for (const actor of actors) {
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
    action.currentTarget = this._target;
    if (!this._observers) return;
    if (!Array.isArray(this._observers)) return this._observers.execute(action);

    // fix case where observable unlistens and re-listens to events during a notifiction
    const observers = this._observers.concat();
    for (let i = observers.length; i--; ) {
      if (action.canPropagateImmediately === false) break;
      observers[i].execute(action);
    }
  }
}

export * from "./watch-property";
export * from "./collection";
export * from "./actions";