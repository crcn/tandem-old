import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";

export interface IObservable {
  observe(actor: IActor);
  unobserve(actor: IActor);
  notify(action: Action);
}
