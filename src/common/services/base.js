import { BaseActor } from 'common/actors';
import { WrapBus, EmptyResponse } from 'mesh';

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

  setActor(actionType, actor) {
    this.target[actionType] = actor;
  }
}
