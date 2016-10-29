import { Action, defineWorkerAction, TreeNodeAction } from "@tandem/common";
import { IBundleStrategyOptions } from "@tandem/sandbox";

export class DOMNodeAction extends Action {
  static readonly DOM_NODE_LOADED = "domNodeLoaded";
}

export class AttributeChangeAction extends Action {
  static readonly ATTRIBUTE_CHANGE = "attributeChange";
  constructor(readonly name: string, readonly value: string) {
    super(AttributeChangeAction.ATTRIBUTE_CHANGE);
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

export class SyntheticBrowserAction extends Action {
  static readonly BROWSER_LOADED = "browserLoaded";
}

@defineWorkerAction()
export class OpenRemoteBrowserAction extends Action {
  static readonly OPEN_REMOTE_BROWSER = "openRemoteBrowser";
  constructor(readonly url: string, readonly options: IBundleStrategyOptions) {
    super(OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER);
  }
}

const DOM_NODE_MUTATION_ACTION_TYPES = {
  [TreeNodeAction.NODE_ADDED]: true,
  [TreeNodeAction.NODE_REMOVED]: true,
  [DOMMutationAction.DOM_NODE_LOADED]: true,
  [AttributeChangeAction.ATTRIBUTE_CHANGE]: true
};

export function isDOMMutationAction(action: Action) {
  return DOM_NODE_MUTATION_ACTION_TYPES[action.type];
}