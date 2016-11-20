import { IDispatcher } from "@tandem/mesh";
import { Action } from "@tandem/common/messages";

export interface IObservable {
  observe(actor: IDispatcher<any, any>);
  unobserve(actor: IDispatcher<any, any>);
  notify(action: Action);
}
