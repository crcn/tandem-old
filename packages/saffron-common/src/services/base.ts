import { IActor } from '../actors/index' 
import BaseApplication from '../application/base';
import { WrapBus, EmptyResponse, ParallelBus, Bus } from 'mesh';
import { Action } from '../actions/index';

export default class Service implements IActor {

  /**
   * Takes target as argument which contains all the handlers
   */

  constructor() { }

  execute(action:Action):any {
    var actor = this[action.type];
    if (actor) {

      // child classes must use loggable mixin
      if ((this as any).logger) {
        (this as any).logger.verbose('execute %s', action.type);
      }

      return WrapBus.create(
        typeof actor === 'function' ? actor.bind(this) : actor
      ).execute(action);
    }

    return new EmptyResponse();
  }

  addActor(actionType, actor:any) {

    actor = WrapBus.create(actor);

    var existingActor:IActor|ParallelBus;

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
