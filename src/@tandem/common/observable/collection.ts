import { Observable } from "./index";
import { IObservable } from "../observable";
import { ArrayMetadataChangeEvent } from "./messages";
import { Action, MetadataChangeEvent } from "@tandem/common/messages";
import { BubbleDispatcher } from "@tandem/common/dispatchers";
import { CallbackDispatcher, IDispatcher } from "@tandem/mesh";
import { ArrayDiff, ArrayDiffInsert, ArrayDiffRemove, ArrayDiffUpdate } from "@tandem/common/utils";

export class ObservableCollection<T> extends Array<T> implements IObservable {
  private _observable: Observable;
  private _itemObserver: IDispatcher<any, any>;

  constructor(...items: T[]) {
    super(...items);
    this._observable = new Observable(this);
    this._itemObserver = new BubbleDispatcher(this);
    this._watchItems(this);
  }

  observe(actor: IDispatcher<any, any>) {
    this._observable.observe(actor);
  }

  unobserve(actor: IDispatcher<any, any>) {
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

    const deletes: ArrayDiffRemove[] = this.slice(start, start + deleteCount).map((item, index) => {

      if (item && item["unobserve"]) {
        (<IObservable><any>item).unobserve(this._itemObserver);
      }

      return new ArrayDiffRemove(item, start + index);
    });

    const inserts: ArrayDiffInsert<T>[] = newItems.map((item, index) => {
      return new ArrayDiffInsert(start + index, item);
    });

    const ret = super.splice(start, deleteCount, ...newItems);


    this._watchItems(newItems);
    this.notify(new ArrayMetadataChangeEvent(new ArrayDiff([...deletes, ...inserts])));
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