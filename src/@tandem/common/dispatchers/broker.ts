import { Action } from "@tandem/common/messages";
import { IBrokerBus } from "./base";
import * as assert from "assert";
import {
  ParallelBus,
  IDispatcher,
  IBus,
  TransformStream,
  FanoutBusDispatchersParamType,
  IMessageTester
} from "@tandem/mesh";

/**
 * @deprecated apps should never directly register listeners to a main bus. Instead they should interface
 * with a public collection
 *
 * @export
 * @class BrokerBus
 * @implements {IBrokerBus}
 */

export class BrokerBus implements IBrokerBus {

  readonly actors: Array<IDispatcher<any, any>>;
  private _bus: IBus<any>;

  constructor(busClass: { new(actors: FanoutBusDispatchersParamType<any>): IBus<any> } = ParallelBus, ...actors: Array<IDispatcher<any, any>>) {
    this.actors = [];

    this._bus = new busClass((message: Action) => {

      // dispatches are expensive since they typically use streams. This chunk reduces
      // unecessary operations to dispatch handlers that can't handle a given message.
      const actors = this.actors.filter((actor) => {
        return !(<IMessageTester<any>><any>actor).testMessage || (<IMessageTester<any>><any>actor).testMessage(message);
      });

      return actors;
    });
    this.register(...actors);
  }

  register(...actors: Array<IDispatcher<any, any>>) {
    for (const actor of actors) assert(actor && actor.dispatch);
    this.actors.push(...actors);
  }

  unregister(...actors: Array<IDispatcher<any, any>>) {
    for (const actor of actors) {
      const i = this.actors.indexOf(actor);
      if (i !== -1) {
        this.actors.splice(i, 1);
      }
    }
  }

  dispatch(action: Action) {
    return this._bus.dispatch(action);
  }
}