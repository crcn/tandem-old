import { Action, TreeNodeMutationTypes } from "@tandem/common";
import { ISyntheticBrowserOpenOptions } from "@tandem/synthetic-browser";
import { SyntheticCSSStyleDeclaration } from "@tandem/synthetic-browser/dom/css";
import {
  SyntheticDocumentMutationTypes,
  SyntheticCSSAtRuleMutationTypes,
  SyntheticDOMElementMutationTypes,
  SyntheticCSSStyleRuleMutationTypes,
  SyntheticDOMContainerMutationTypes,
  SyntheticDOMValueNodeMutationTypes,
  SyntheticCSSStyleSheetMutationTypes,
} from "@tandem/synthetic-browser/dom";

export class DOMNodeEvent extends Action {
  static readonly DOM_NODE_LOADED = "domNodeLoaded";
}

export class SyntheticRendererEvent extends Action {
  static readonly UPDATE_RECTANGLES = "updateRectangles";
}

export class OpenRemoteBrowserRequest extends Action {
  static readonly OPEN_REMOTE_BROWSER = "openRemoteBrowser";
  constructor(readonly options: ISyntheticBrowserOpenOptions) {
    super(OpenRemoteBrowserRequest.OPEN_REMOTE_BROWSER);
  }
}

const DOM_NODE_MUTATION_EVENT_TYPES = {
  [TreeNodeMutationTypes.NODE_ADDED]: true,
  [TreeNodeMutationTypes.NODE_REMOVED]: true,
  [SyntheticCSSAtRuleMutationTypes.INSERT_CSS_RULE_EDIT]: true,
  [SyntheticCSSAtRuleMutationTypes.REMOVE_CSS_RULE_EDIT]: true,
  [SyntheticCSSAtRuleMutationTypes.MOVE_CSS_RULE_EDIT]: true,
  [SyntheticDocumentMutationTypes.ADD_DOCUMENT_STYLE_SHEET_EDIT]: true,
  [SyntheticDocumentMutationTypes.REMOVE_DOCUMENT_STYLE_SHEET_EDIT]: true,
  [SyntheticDocumentMutationTypes.MOVE_DOCUMENT_STYLE_SHEET_EDIT]: true,
  [SyntheticCSSStyleSheetMutationTypes.INSERT_STYLE_SHEET_RULE_EDIT]: true,
  [SyntheticCSSStyleSheetMutationTypes.REMOVE_STYLE_SHEET_RULE_EDIT]: true,
  [SyntheticCSSStyleSheetMutationTypes.MOVE_STYLE_SHEET_RULE_EDIT]: true,
  [SyntheticCSSStyleRuleMutationTypes.SET_DECLARATION]: true,
  [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT]: true,
  [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT]: true,
};

export function isDOMMutationEvent(action: Action) {
  return DOM_NODE_MUTATION_EVENT_TYPES[action.type];
}