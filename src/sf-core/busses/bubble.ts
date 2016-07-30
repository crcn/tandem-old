import { Action } from "../actions";
import { IActor } from "../actors";
import { IObservable } from "../observable";

export class BubbleBus implements IActor {
  constructor(readonly target: IObservable) { }
  execute(action: Action) {
    this.target.notify(action);
  }
}