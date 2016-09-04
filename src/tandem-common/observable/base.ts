import { IActor } from "tandem-common/actors";
import { Action } from "tandem-common/actions";

export interface IObservable {
  observe(actor: IActor);
  unobserve(actor: IActor);
  notify(action: Action);
}
