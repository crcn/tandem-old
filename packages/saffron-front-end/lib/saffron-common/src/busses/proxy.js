"use strict";
const mesh_1 = require('mesh');
/**
 * proxies a target bus, and queues actions
 * if there is none until there is
 */
class ProxyBus extends mesh_1.Bus {
    constructor(_target) {
        super();
        this._target = _target;
        this._queue = [];
    }
    execute(action) {
        // no target? put the action in a queue until there is
        if (this.paused) {
            return mesh_1.Response.create((writable) => {
                this._queue.push({
                    action: action,
                    writable: writable,
                });
            });
        }
        return this.target.execute(action);
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
        if (this.paused)
            return;
        while (this._queue.length) {
            var { writable, action } = this._queue.shift();
            (this.target.execute(action) || mesh_1.EmptyResponse.create()).pipeTo(writable);
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProxyBus;
//# sourceMappingURL=proxy.js.map