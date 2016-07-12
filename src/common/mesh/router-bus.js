import { Bus, WrapBus } from 'mesh';

export default class RouterBus extends Bus {
  constructor(routes) {
    super();
    this._routes = {};
    for (var key in routes) {
      this._routes[key] = WrapBus.create(routes[key]);
    }
  }

  execute(event) {
    var bus = this._routes[event.type];
    if (bus) {
      return bus.execute(event);
    }
  }
}
