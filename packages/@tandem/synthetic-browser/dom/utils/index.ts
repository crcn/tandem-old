import { PropertyWatcher, Observable } from "@tandem/common";
import { IDOMEventEmitter, DOMEventListenerFunction } from "../events";

export const bindDOMEventMethods = (eventTypes: string[], target: Observable & IDOMEventEmitter) => {
  function handleDOMEventMethod(type: string, newListener: DOMEventListenerFunction, oldListener: DOMEventListenerFunction) {

    if (oldListener) {
      target.removeEventListener(type, newListener);
    }

    if (newListener) {
      target.addEventListener(type, newListener);
    }
  }

  eventTypes.forEach((eventType: string) => {
    new PropertyWatcher(target, `on${eventType.toLowerCase()}`).connect(handleDOMEventMethod.bind(target, eventType));
  });
}


export const bindDOMNodeEventMethods = (target: Observable & IDOMEventEmitter, ...additional: string[]) => {
  bindDOMEventMethods(["load", ...additional], target);
}
