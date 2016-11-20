import { Action } from "../messages";
import { IDispatcher } from "@tandem/mesh";
import { IObservable } from "../observable";

export class BubbleDispatcher implements IDispatcher<any, any> {
  constructor(readonly target: IObservable) { }
  dispatch(action: Action) {
    this.target.notify(action);
  }
}