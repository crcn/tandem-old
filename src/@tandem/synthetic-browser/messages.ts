import { Action, TreeNodeEvent } from "@tandem/common";
import {ISyntheticBrowserOpenOptions } from "@tandem/synthetic-browser";
import { SyntheticCSSStyleDeclaration } from "@tandem/synthetic-browser/dom/css";

export class DOMNodeEvent extends Action {
  static readonly DOM_NODE_LOADED = "domNodeLoaded";
}

export class AttributeChangeEvent extends Action {
  static readonly ATTRIBUTE_CHANGE = "attributeChange";
  constructor(readonly name: string, readonly value: string) {
    super(AttributeChangeEvent.ATTRIBUTE_CHANGE);
  }
}

export class CSSDeclarationValueChangeEvent extends Action {
  static readonly CSS_DECLARATION_VALUE_CHANGE = "cssDeclarationValueChange";
  constructor(readonly item: SyntheticCSSStyleDeclaration, readonly name: string, readonly newValue: string, readonly oldName?: string) {
    super(CSSDeclarationValueChangeEvent.CSS_DECLARATION_VALUE_CHANGE);
  }
}

// TODO - add these https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
export class DOMMutationEvent extends Action {
  static readonly DOM_NODE_LOADED = "domNodeLoaded";
}

export class SyntheticRendererEvent extends Action {
  static readonly UPDATE_RECTANGLES = "updateRectangles";
  static readonly UPDATED_COMPUTED_STYLE = "updatedComputedStyle";
}

export class OpenRemoteBrowserRequest extends Action {
  static readonly OPEN_REMOTE_BROWSER = "openRemoteBrowser";
  constructor(readonly options: ISyntheticBrowserOpenOptions) {
    super(OpenRemoteBrowserRequest.OPEN_REMOTE_BROWSER);
  }
}

const DOM_NODE_MUTATION_EVENT_TYPES = {
  [TreeNodeEvent.NODE_ADDED]: true,
  [TreeNodeEvent.NODE_REMOVED]: true,
  [DOMMutationEvent.DOM_NODE_LOADED]: true,
  [AttributeChangeEvent.ATTRIBUTE_CHANGE]: true,
  [CSSDeclarationValueChangeEvent.CSS_DECLARATION_VALUE_CHANGE]: true
};

export function isDOMMutationEvent(action: Action) {
  return DOM_NODE_MUTATION_EVENT_TYPES[action.type];
}