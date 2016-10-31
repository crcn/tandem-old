import { } from "./reader";

export interface IReadableStreamOptions {
  size?: number;
  highWaterMark?: number;
}

export interface IPipeToOptions {
  preventClose?: boolean;
  preventAbort?: boolean;
  preventCancel?: boolean;
}

export interface IPipeThroughDestination {
  writable: any;
  readable: any;
}

export interface IStreamSource {

  bytes?: any;

  /**
   * Called imediately - used to a
   *
   * @param {any} controller
   */

  start?(controller);

  /**
   * Called when the stream's internal queue is not full
   *
   * @param {any} controller
   */

  pull?(controller);

  /**
   * Called when consumer signals that they are no longer
   * inretested in the stream.
   *
   * @param {*} reason
   */

  cancel?(reason: any);
}

export class ReadableStream {

  private _locked: boolean;
  private _mode: string;

  constructor(private _source: IStreamSource, { size, highWaterMark }: IReadableStreamOptions = {}) {

  }

  /**
   * TRUE if the stream is locked to a reader
   */

  get locked(): boolean {
    return this._locked;
  }

  /**
   * Signal loss of interest in stream by consumer
   */

  cancel(reason: any) {

  }

  getReader({ mode }: { mode?: "byob" }) {
    this._mode = mode;
  }

  pipeThrough(dest: IPipeThroughDestination, options: any = {}) {

  }

  pipeTo(des, options: IPipeToOptions = {}) {

  }


  /**
   * Forks this readable stream, returning a two element array containing the two resulting
   * branches as a new ReadableStream instance.
   *
   * Teeing a stream will lock it, preventing any other consumer from acquiring a reader. To cancel the stream, cancel
   * both of the resulting branches. Cancellation reason will be propagated to the stream's underlying source.
   *
   * Note that chunks seen in each branch will be the same object.
   */

  tee(): [ReadableStream, ReadableStream] {
    // const child = new ReadableStream()
    return [null, null];
  }
}