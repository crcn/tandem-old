import { IActor } from "sf-common/actors";
import { Action } from "sf-common/actions";

export interface IObservable {
  observe(actor: IActor);
  unobserve(actor: IActor);
  notify(action: Action);
}
