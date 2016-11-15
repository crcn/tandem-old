import { IDispatcher } from "./base";

export class NoopDispatcher implements IDispatcher<any> {
  dispatch(message: any) { }
}