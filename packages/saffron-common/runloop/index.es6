import rAF from '../utils/next-tick';
import create from '../utils/class/create';

let defaultTick;

/* istanbul ignore next */
if (process.browser) {
  defaultTick = function (next) {
    rAF(next);
  };
} else {
  defaultTick = function (next) {
    next();
  };
}

/**
*/

export default class Runloop {

  /**
  */

  constructor(options = {}) {

    var { id, tick } = options;

    this._queue = [];
    this._id    = id   || 2;
    this.tick   = tick || defaultTick;
  }

  /**
  * child runloop in-case we get into recursive loops
  */

  get child() {
    return this.__child || (this.__child = new Runloop({ tick: this.tick, id: this._id << 2 }));
  }


  /**
  * Runs animatable object on requestAnimationFrame. This gets
  * called whenever the UI state changes.
  *
  * @method animate
  * @param {Object} animatable object. Must have `update()`
  */

  deferOnce(context) {

    if (!context.__running) context.__running = 1;

    if (context.__running & this._id) {
      if (this._running) {
        this.child.deferOnce(context);
      }
      return;
    }

    context.__running |= this._id;

    // push on the animatable object
    this._queue.push(context);

    // if animating, don't continue
    if (this._requestingFrame) return;
    this._requestingFrame = true;

    // run the animation frame, and callback all the animatable objects
    this.tick(() => {
      this.runNow();
      this._requestingFrame = false;
    });
  }

  /**
  */

  runNow() {
    const queue = this._queue;
    this._queue   = [];
    this._running = true;

    // queue.length is important here, because animate() can be
    // called again immediately after an update
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      item.update();
      item.__running &= ~this._id;

      // check for anymore animations - need to run
      // them in order
      if (this._queue.length) {
        this.runNow();
      }
    }

    this._running = false;
  }

  /**
   */

  static create = create;
}
