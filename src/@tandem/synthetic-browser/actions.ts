import { Action, TreeNodeAction } from "@tandem/common";
import {ISyntheticBrowserOpenOptions } from "@tandem/synthetic-browser";
import { SyntheticCSSStyleDeclaration } from "@tandem/synthetic-browser/dom/css";

export class DOMNodeAction extends Action {
  static readonly DOM_NODE_LOADED = "domNodeLoaded";
}

export class AttributeChangeAction extends Action {
  static readonly ATTRIBUTE_CHANGE = "attributeChange";
  constructor(readonly name: string, readonly value: string) {
    super(AttributeChangeAction.ATTRIBUTE_CHANGE);
  }
}

export class CSSDeclarationValueChangeAction extends Action {
  static readonly CSS_DECLARATION_VALUE_CHANGE = "cssDeclarationValueChange";
  constructor(readonly item: SyntheticCSSStyleDeclaration, readonly name: string, readonly newValue: string, readonly oldName?: string) {
    super(CSSDeclarationValueChangeAction.CSS_DECLARATION_VALUE_CHANGE);
  }
}

// TODO - add these https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
export class DOMMutationAction extends Action {
  static readonly DOM_NODE_LOADED = "domNodeLoaded";
}

export class SyntheticRendererAction extends Action {
  static readonly UPDATE_RECTANGLES = "updateRectangles";
  static readonly UPDATED_COMPUTED_STYLE = "updatedComputedStyle";
}

export class OpenRemoteBrowserRequest extends Action {
  static readonly OPEN_REMOTE_BROWSER = "openRemoteBrowser";
  constructor(readonly options: ISyntheticBrowserOpenOptions) {
    super(OpenRemoteBrowserRequest.OPEN_REMOTE_BROWSER);
  }
}

const DOM_NODE_MUTATION_ACTION_TYPES = {
  [TreeNodeAction.NODE_ADDED]: true,
  [TreeNodeAction.NODE_REMOVED]: true,
  [DOMMutationAction.DOM_NODE_LOADED]: true,
  [AttributeChangeAction.ATTRIBUTE_CHANGE]: true,
  [CSSDeclarationValueChangeAction.CSS_DECLARATION_VALUE_CHANGE]: true
};

export function isDOMMutationAction(action: Action) {
  return DOM_NODE_MUTATION_ACTION_TYPES[action.type];
}