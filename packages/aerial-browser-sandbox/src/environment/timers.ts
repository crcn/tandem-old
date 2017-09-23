import { weakMemo } from "aerial-common2";

export interface SEnvTimersInterface {
  setTimeout(callback: any, ms: number, ...args);
  clearTimeout(timer: any);
  setInterval(callback: any, ms: number, ...args);
  clearInterval(callback: any);
  setImmediate(callback: any);
  clearImmediate(callback: any);
  dispose();
}

export const getSEnvTimerClasses = weakMemo((context: any) => {
  class SEnvTimers implements SEnvTimersInterface {
    private _timers: any[];

    constructor() {
      this._timers = [];
    }
    setTimeout(callback: any, ms: number, ...args) {
      const timer = setTimeout(callback, ms, ...args);
      this._timers.push(timer);
      return timer;
    }
    clearTimeout(timer: any) {
      clearTimeout(timer);
      this.clearTimer(timer);
    }
    setInterval(callback: any, ms: number, ...args) {
      const timer = setInterval(callback, ms, ...args);
      this._timers.push(timer);
      return timer;
    }
    clearInterval(timer: any) {
      clearInterval(timer);
      this.clearTimer(timer);
    }
    clearImmediate(timer: any) {
      clearImmediate(timer);
      this.clearTimer(timer);
    }
    clearTimer(timer: any) {
      const index = this._timers.indexOf(timer);
      if (index !== -1) {
        clearTimeout(timer);
        this._timers.splice(index, 1);
      }
    }
    setImmediate(callback: any) {
      const timer = setImmediate(callback);
      this._timers.push(timer);
      return timer;
    }
    dispose() {
      for (let i = this._timers.length; i--;) {
        clearInterval(this._timers[i]);
        clearTimeout(this._timers[i]);
        clearImmediate(this._timers[i]);
      }
      this._timers = [];
    }
  }

  return { SEnvTimers };
});