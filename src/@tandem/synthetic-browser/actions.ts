import { Action, defineWorkerAction } from "@tandem/common/actions";

export class SyntheticRendererAction extends Action {
  static readonly UPDATE_RECTANGLES = "updateRectangles";
}

export class SyntheticBrowserAction extends Action {
  static readonly BROWSER_LOADED = "browserLoaded";
}

export class DOMEntityAction extends Action {
  static readonly DOM_ENTITY_DIRTY = "domEntityDirty";
}

@defineWorkerAction()
export class OpenRemoteBrowserAction extends Action {
  static readonly OPEN_REMOTE_BROWSER = "openRemoteBrowser";
  constructor(readonly url: string) {
    super(OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER);
  }
}