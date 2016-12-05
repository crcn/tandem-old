import { IMessage, IDispatcher } from "@tandem/mesh";
import { CoreEvent, Observable } from "@tandem/common";
import { SyntheticDOMNode } from "../markup";

export class SyntheticDOMEvent<T> extends CoreEvent {
  readonly target: T;
  constructor(readonly type: string) {
    super(type);
  }
}

export namespace DOMEventTypes {

  /**
   * Fired when all nodes have been added to the Document object -- different from LOAD
   * since DOM_CONTENT_LOADED doesn't wait for other assets such as stylesheet loads.
   */

  export const DOM_CONTENT_LOADED = "DOMContentLoaded";

  /**
   * Fired after all assets and DOM content has loaded
   */

  export const LOAD = "load";
}

export type DOMEventListenerFunction = <T extends SyntheticDOMNode>(event: SyntheticDOMEvent<T>) => boolean|void;

export class DOMEventDispatcher implements IDispatcher<SyntheticDOMEvent<any>, void> {
  constructor(readonly type: string, readonly listener: DOMEventListenerFunction) { }

  dispatch(event: SyntheticDOMEvent<any>) {

    // TODO - check bool return value from event listener
    if (event.type === this.type) {
      this.listener(event);
    }
  }
}

export interface IDOMEventEmitter {
  addEventListener(type: string, listener: DOMEventListenerFunction, capture?: boolean);
  removeEventListener(type: string, listener: DOMEventListenerFunction, capture?: boolean);
}

// TODO - implement capture bool check
export class DOMEventDispatcherMap {
  private _map: Map<string, DOMEventDispatcher[]>
  
  constructor(readonly target: Observable) {
    this._map = new Map();
  }

  add(type: string, listener: DOMEventListenerFunction, capture?: boolean) {
    const observer = new DOMEventDispatcher(type, listener);

    if (!this._map.has(type)) {
      this._map.set(type, []);
    }

    this._map.get(type).push(observer);
    this.target.observe(observer);
  }

  remove(type: string, listener: DOMEventListenerFunction, capture?: boolean) {
    const observers = this._map.get(type) || [];
    for (let i = observers.length; i--;) {
      const observer = observers[i];
      if (observer.listener === listener) {
        observers.splice(i, 1);
        this.target.unobserve(observer);
        break;
      }
    } 
  }
}