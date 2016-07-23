import { Action } from "../actions";
import { ParallelBus, Bus } from "mesh";

/**
 * handles actions
 */

export interface IActor {
  execute(action: Action): any;
}

/**
 * invokes actions an actor
 */

export interface IInvoker {
  bus: IActor;
}

/**
 */

export class Mediator implements IActor {

  // actors on the mediator
  private _actors: Array<IActor> = [];

  // the bus which facilitates all actions -- parallel so that
  // all actors the message at the same time
  private _bus: ParallelBus = new ParallelBus(this._actors);

  constructor() {
  }

  /**
   * executs an action on the mediator and all of its actors
   */

  execute(action: Action) {
    return this._bus.execute(action);
  }

  /**
   * adds one or more actors on the mediator
   */

  register(...actors: Array<IActor>) {
    this._actors.push(...actors);
  }

  /**
   * removes one or more actors of the mediator
   */

  remove(...actors: Array<IActor>) {
    for (let i = actors.length; i--; ) {
      const ii = this._actors.indexOf(actors[i]);
      if (ii !== -1) {
        this._actors.splice(ii, 1);
      }
    }
  }
}