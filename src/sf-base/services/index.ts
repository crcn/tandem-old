import { IActor } from "../actors";
import { Action } from "../actions";
import { IApplication } from "../application";
import { WrapBus, EmptyResponse, ParallelBus, Bus } from "mesh";

/**
 * Basic Actor which acts on action types -- typically sub-classed
 */

export class Service implements IActor {

  /**
   */

  public execute(action: Action): any {
    const actor = this[action.type];

    if (actor) {

      // child classes must use loggable mixin
      if ((this as any).logger) {
        (this as any).logger.verbose("execute %s", action.type);
      }

      return WrapBus.create(
        typeof actor === "function" ? actor.bind(this) : actor
      ).execute(action);
    }

    return new EmptyResponse();
  }

  /**
   * Adds an actor to an action type
   */

  public addActor(actionType: string, actor: any): void {

    actor = WrapBus.create(actor);

    let existingActor: IActor|ParallelBus;

    if (existingActor = this[actionType]) {
      if ((existingActor as any)._busses) {
        (existingActor as any)._busses.push(actor);
      } else {
        this[actionType] = new ParallelBus([existingActor, actor]);
      }
    } else {
      this[actionType] = actor;
    }
  }
}
