import { IDispatcher } from "./base";
import { ReadableStream } from "@tandem/mesh/streams";

export type DispatcherCallback<T, U> = (message: T) => U;

export class CallbackDispatcher<T, U> implements IDispatcher<T> {
  constructor(readonly callback: DispatcherCallback<T, U>) { }

  dispatch(message: T) {
    return this.callback(message);
  }
}