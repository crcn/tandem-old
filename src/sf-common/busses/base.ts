import { IActor } from "sf-common/actors";

export interface IBrokerBus extends IActor {
  actors: Array<IActor>;
  register(actor: IActor);
  unregister(actor: IActor);
}