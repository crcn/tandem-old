import { Action } from "sf-common/actions";
import { IActor } from "sf-common/actors";

export class CallbackBus implements IActor {
  constructor(readonly callback: (action: Action) => any) { }
  execute(action: Action) {
    return this.callback(action);
  }
}
