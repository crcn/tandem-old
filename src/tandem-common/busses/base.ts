import { IActor } from "tandem-common/actors";

export interface IBrokerBus extends IActor {
  actors: Array<IActor>;
  register(actor: IActor);
  unregister(actor: IActor);
}