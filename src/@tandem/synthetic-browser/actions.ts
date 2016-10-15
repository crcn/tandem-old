import { Action } from "@tandem/common/actions";

export class SyntheticRendererAction extends Action {
  static readonly UPDATE_RECTANGLES = "updateRectangles";
}

export class SyntheticBrowserAction extends Action {
  static readonly OPENED = "opened";
  static readonly LOADED = "loaded";
}

export class DOMEntityAction extends Action {
  static readonly DOM_ENTITY_DIRTY = "domEntityDirty";
}