import { Action } from "../actions";
import { Response } from "mesh";

/**
 * handles actions
 */

export interface IActor {
  execute(action: Action): any;
}

/**
 * invokes actions against an IActor. There's a special
 * interface for this to help identify objects that invoke actions -- useful
 * for things such as decorators.
 */

export interface IInvoker {
  bus: IActor;
}
