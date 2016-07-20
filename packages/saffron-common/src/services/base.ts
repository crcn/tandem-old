import { BaseActor } from '../actors/index' 
import { WrapBus, EmptyResponse, ParallelBus, Bus } from 'mesh';

export default class Service extends BaseActor {

  /**
   */

  public target:any;
  public app:any; 
  public bus:Bus;

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
      if ((this as any).logger) {
        (this as any).logger.verbose('execute %s', action.type);
      }

      return WrapBus.create(
        typeof actor === 'function' ? actor.bind(this.target) : actor
      ).execute(action);
    }

    return new EmptyResponse();
  }

  addActor(actionType, actor:any) {

    actor = WrapBus.create(actor);

    var existingActor:BaseActor|ParallelBus;

    if (existingActor = this.target[actionType]) {
      if ((existingActor as any)._busses) {
        (existingActor as any)._busses.push(actor);
      } else {
        this.target[actionType] = new ParallelBus([existingActor, actor]);
      }
    } else {
      this.target[actionType] = actor;
    }

  }
}
