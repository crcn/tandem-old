import { DuplexStream, TransformStream } from "@tandem/mesh/streams";

/**
 * Dispatches a message to a listener
 */

export interface IDispatcher<T> {

  /**
   */

  dispatch(message: T): any;
}

/**
 * Contro
 */

export interface IBus<T> extends IDispatcher<T> {

  /**
   */

  dispatch(message: T): TransformStream<any, any>;
}