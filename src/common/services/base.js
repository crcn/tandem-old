import { BaseActor } from 'common/actors';

export default class BaseService extends BaseActor {  
  execute(event) {
    if (this[event.type]) {
      return this[event.type](event);
    }
  }
}
