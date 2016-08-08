import { IDisposable } from "sf-core/object";
import { IObservable, Observable } from "sf-core/observable";
import { Action, DisposeAction } from "sf-core/actions";
import { IActor } from "sf-core/actors";

export class Selection<T extends IDisposable> extends Array<T> implements IObservable {

  private _observable: Observable;

  constructor(...items: T[]) {
    super(...items);
    this._observable = new Observable(this);
  }

  dispose() {
    for (const disposable of this) {
      disposable.dispose();
    }

    this.notify(new DisposeAction());
  }

  observe(actor: IActor) {
    this._observable.observe(actor);
  }

  unobserve(actor: IActor) {
    this._observable.unobserve(actor);
  }

  notify(action: Action) {
    this._observable.notify(action);
  }
}