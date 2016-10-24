import { IActor } from "@tandem/common/actors";
import { Action } from "@tandem/common/actions";
import { WrapBus, EmptyResponse } from "mesh";

export class TypeWrapBus implements IActor {

  private _bus: WrapBus;

  constructor(readonly type: string, handler: Function|IActor) {
    this.type = type;
    this._bus = WrapBus.create(<any>handler);
  }

  execute(action: Action) {
    if (action.type === this.type) {
      return this._bus.execute(action);
    }
    return EmptyResponse.create();
  }
}
