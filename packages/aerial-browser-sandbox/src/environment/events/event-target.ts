import { weakMemo } from "aerial-common2";
import { EventTargetInterface } from "./event";


const callEventListener = (listener: EventListenerOrEventListenerObject, event: Event) => {
  if (typeof listener === "function") {
    listener(event);
  } else if (listener) { 
    listener.handleEvent(event);
  };
}

export const getSEnvEventTargetClass = weakMemo((context?: any) => {

  class SEnvEventTarget implements EventTarget {
    private ___eventListeners: {
      [identifier: string]: EventListenerOrEventListenerObject | EventListenerOrEventListenerObject[]
    }

    constructor() {
      this.___eventListeners = {};
    }

    addEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
      if (!this.___eventListeners[type]) {
        this.___eventListeners[type] = listener;
      } else if (!Array.isArray(this.___eventListeners[type])) {
        this.___eventListeners[type] = [this.___eventListeners[type] as EventListenerOrEventListenerObject, listener];
      } else {
        (this.___eventListeners[type] as EventListenerOrEventListenerObject[]).push(listener);
      }
    }

    dispatchEvent(event: Event): boolean {
      const eva = event as EventTargetInterface;
      eva.$currentTarget = this;
      if (!eva.$target) {
        eva.$target = this;
      }
      const listeners = this.___eventListeners[event.type];
      if (!listeners) return false;
      if (Array.isArray(listeners)) {
        for (const listener of listeners) {
          // -- TODO -- check for stopImmediatePropagation
          callEventListener(listener, event);
        }
      } else {
        callEventListener(listeners, event);
      }
      return true;
    }

    removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
      const listeners = this.___eventListeners[type];
      if (!listeners) return;
      if (listeners === listener) {
        this.___eventListeners[type] = undefined;
      } else if (Array.isArray(listeners)) {
        const index = listeners.indexOf(listener);
        (listeners as EventListenerOrEventListenerObject[]).splice(index, 1);
        if (listeners.length === 1) {
          this.___eventListeners[type] = listeners[0];
        }
      } 
    }
  }

  SEnvEventTarget.prototype["___eventListeners"] = {};

  return SEnvEventTarget;
});