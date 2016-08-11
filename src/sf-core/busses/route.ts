import { Action } from "../actions";
import { IActor } from "../actors";
import { Bus, WrapBus } from "mesh";

export class RouteBus extends Bus {
  private _handlers = {};

  execute(action: Action) {
    const handler = this._handlers[action.type];
    return handler ? handler.execute(action) : undefined;
  }

  register(actionType: string, handler: any) {
    // TODO - check for existence of handlers
    this._handlers[actionType] = WrapBus.create(handler);
  }
}