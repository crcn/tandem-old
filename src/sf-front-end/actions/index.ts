import { Action } from "sf-core/actions";
import { IRange } from "sf-core/geom";

export const STAGE_CANVAS_MOUSE_DOWN = "stageCanvasMouseDown";
export class MouseEvent extends Action {
  constructor(type, originalEvent) {
    super(type);
    Object.assign(this, {
      clientX : originalEvent.clientX,
      clientY : originalEvent.clientY,
      metaKey : originalEvent.metaKey
    });
  }
}

export const SELECT = "select";
export class SelectAction extends Action {

  public items: Array<any>;
  public keepPreviousSelection: boolean;
  public toggle: boolean;

  constructor(items: any = undefined, keepPreviousSelection = false, toggle = false) {
    super(SELECT);
    this.items = Array.isArray(items) ? items : items == null ? [] : [items];
    this.keepPreviousSelection = !!keepPreviousSelection;
    this.toggle = toggle;
  }
}

export const SELECT_SOURCE_AT_OFFSET = "selectAtSourceOffset";
export class SelectSourceAtOffsetAction extends Action {
  readonly data: Array<IRange>;
  constructor(...data: Array<IRange>) {
    super(SELECT_SOURCE_AT_OFFSET);
    this.data = data;
  }
}

export class ToggleSelectAction extends SelectAction {
  constructor(items = undefined, keepPreviousSelection: boolean = false) {
    super(items, keepPreviousSelection, true);
  }
}

export const ZOOM = "zoom";
export class ZoomAction extends Action {
  constructor(readonly delta: number) {
    super(ZOOM);
  }
}

export const OPEN_FILE = "openFile";
export class OpenFileAction extends Action {
  constructor(readonly path: string, readonly ext: string, readonly content: string) {
    super(OPEN_FILE);
  }
}