import { IActor } from "sf-core/actors";

export interface IBrokerBus extends IActor {
  actors: Array<IActor>;
  register(actor: IActor);
  unregister(actor: IActor);
}