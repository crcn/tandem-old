import { BaseActor } from '../actors';
import { WrapBus, EmptyResponse, ParallelBus } from 'mesh';

export default class Service extends BaseActor {

  /**
   * Takes target as argument which contains all the handlers
   */

  constructor(properties) {
    super(properties);
    if (!this.target) {
      this.target = this;
    }
  }

  execute(action) {
    var actor = this.target[action.type];
    if (actor) {

      // child classes must use loggable mixin
      if (this.logger) {
        this.logger.verbose('execute %s', action.type);
      }

      return WrapBus.create(
        typeof actor === 'function' ? actor.bind(this.target) : actor
      ).execute(action);
    }

    return EmptyResponse.create();
  }

  addActor(actionType, actor) {

    var existingActor;

    if (existingActor = this.target[actionType]) {
      if (existingActor._busses) {
        existingActor._busses.push(actor);
      } else {
        this.target[actionType] = ParallelBus.create([existingActor, actor]);
      }
    } else {
      this.target[actionType] = actor;
    }

  }
}
