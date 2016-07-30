import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";

export class CallbackBus implements IActor {
  constructor(readonly callback: (action: Action) => any) { }
  execute(action: Action) {
    return this.callback(action);
  }
}
