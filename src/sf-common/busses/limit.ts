import { Action } from "sf-common/actions";
import { IActor } from "sf-common/actors";
import { Response } from "mesh";


// TODO - remove me - use LimitBus from mesh instead
export class LimitBus implements IActor {
  private _queue = [];
  private _running: number = 0;

  constructor(readonly max: number, readonly actor: IActor) { }

  execute(action: Action) {
    return new Response((writable) => {
      if (this._running > this.max) {
        this._queue.push({ action: action, writable: writable });
        return;
      }
      this._running++;

      const complete = () => {
        this._running--;
        if (this._queue.length) {
          const item = this._queue.shift();
          this.execute(item.action).pipeTo(item.writable);
        }
      };

      this.actor.execute(action).pipeTo({
        write: writable.write.bind(writable),
        abort: (reason) => {
          writable.abort(reason);
          complete();
        },
        close: () => {
          writable.close();
          complete();
        }
      });
    });
  }
}