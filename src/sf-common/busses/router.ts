import { Bus, WrapBus, EmptyResponse } from "mesh";

export class RouterBus extends Bus {
  private _routes: Object;

  constructor(routes: Object) {
    super();
    this._routes = {};
    for (let key in routes) {
      this._routes[key] = WrapBus.create(routes[key]);
    }
  }

  execute(event) {
    const bus = this._routes[event.type];
    if (bus) {
      return bus.execute(event);
    }
    return EmptyResponse.create();
  }
}
