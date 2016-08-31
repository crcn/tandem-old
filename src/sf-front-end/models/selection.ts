import { IActor } from "sf-core/actors";
import { Metadata } from "sf-core/metadata";
import { IRemovable } from "sf-core/object";
import { Action, RemoveAction } from "sf-core/actions";
import { IObservable, Observable } from "sf-core/observable";

export class Selection<T extends IRemovable> extends Array<T> implements IObservable {

  private _observable: Observable;
  readonly metadata: Metadata;

  constructor(...items: T[]) {
    super(...items);
    this._observable = new Observable(this);
    this.metadata = new Metadata();
  }

  remove() {
    for (const removable of this) {
      removable.remove();
    }

    this.notify(new RemoveAction());
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