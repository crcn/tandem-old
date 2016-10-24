import { IActor } from "@tandem/common/actors";
import { WrapBus } from "mesh";
import { Observable } from "./index";
import { IObservable } from "../observable";
import { ArrayChangeAction } from "./actions";
import { Action, ChangeAction } from "@tandem/common/actions";
import { TypeWrapBus, BubbleBus } from "@tandem/common/busses";

export class ObservableCollection<T> extends Array<T> implements IObservable {
  private _observable: Observable;
  private _itemObserver: IActor;

  constructor(...items: T[]) {
    super(...items);
    this._observable = new Observable(this);
    this._itemObserver = new BubbleBus(this);
    this._watchItems(this);
  }

  observe(actor: IActor) {
    this._observable.observe(actor);
  }

  unobserve(actor: IActor) {
    this._observable.unobserve(actor);
  }

  notify(action: Action) {
    return this._observable.notify(action);
  }

  push(...items: Array<T>) {
    return this.splice(this.length, 0, ...items).length;
  }
  unshift(...items: Array<T>) {
    return this.splice(0, 0, ...items).length;
  }
  shift() {
    return this.splice(0, 1).pop();
  }
  pop() {
    return this.splice(this.length - 1, 1).pop();
  }

  splice(start: number, deleteCount?: number, ...newItems: T[]) {
    const removedItems = this.slice(start, start + deleteCount);
    for (const item of removedItems) {
      if (item && item["unobserve"]) {
        (<IObservable><any>item).unobserve(this._itemObserver);
      }
    }

    const ret = super.splice(start, deleteCount, ...newItems);

    this._watchItems(newItems);
    this.notify(new ArrayChangeAction(removedItems, newItems));
    return ret;
  }

  private _watchItems(newItems: T[]) {
    for (const item of newItems) {
      if (item && item["observe"]) {
        (<IObservable><any>item).observe(this._itemObserver);
      }
    }
  }
}