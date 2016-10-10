import { Action } from "@tandem/common/actions";

export class SyntheticRendererAction extends Action {
  static readonly UPDATE_RECTANGLES = "updateRectangles";
}

export class SyntheticDOMEntityAction extends Action {
  static readonly DOM_ENTITY_DIRTY = "domEntityDirty";
}