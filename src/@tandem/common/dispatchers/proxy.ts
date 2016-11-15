import {
  IBus,
  IDispatcher,
  DuplexStream,
  ReadableStream,
  WritableStream,
  TransformStream,
  wrapDuplexStream,
} from "@tandem/mesh";

/**
 * proxies a target bus, and queues actions
 * if there is none until there is
 */

export class ProxyBus implements IBus<any> {

  private _queue: Array<{ input: ReadableStream<any>, output: WritableStream<any>, action: any }> = [];
  private _paused: boolean;

  constructor(private _target: IDispatcher<any, any>) {
  }

  dispatch(action) {

    // no target? put the action in a queue until there is
    if (this.paused) {
      return new DuplexStream((input, output) => {
        this._queue.push({ action, input, output });
      });
    }

    return wrapDuplexStream(this.target.dispatch(action));
  }

  get paused() {
    return this._paused || !this._target;
  }

  pause() {
    this._paused = true;
  }

  resume() {
    this._paused = false;
    this._drain();
  }

  get target() {
    return this._target;
  }

  set target(value) {
    this._target = value;

    // try draining the proxy now.
    this._drain();
  }

  _drain() {
    if (this.paused) return;
    while (this._queue.length) {
      const { input, output, action } = this._queue.shift();
      wrapDuplexStream(this.target.dispatch(action)).readable.pipeTo(output);
    }
  }
}
