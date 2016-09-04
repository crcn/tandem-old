import { Action } from "tandem-common/actions";
import { IActor } from "tandem-common/actors";

export class CallbackBus implements IActor {
  constructor(readonly callback: (action: Action) => any) { }
  execute(action: Action) {
    return this.callback(action);
  }
}
