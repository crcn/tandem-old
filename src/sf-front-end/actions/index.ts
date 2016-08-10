import { Action } from "sf-core/actions";
import { IRange } from "sf-core/geom";
import { IActor } from "sf-core/actors";

export const CANVAS_MOUSE_DOWN = "canvasMouseDown";
export class MouseAction extends Action {
  constructor(type, readonly originalEvent: MouseEvent) {
    super(type);
    Object.assign(this, {
      clientX : originalEvent.clientX,
      clientY : originalEvent.clientY,
      metaKey : originalEvent.metaKey
    });
  }
  preventDefault() {
    this.originalEvent.preventDefault();
  }
}

export const CANVAS_KEY_DOWN = "canvasKeyDown";
export class KeyboardAction extends Action {
  readonly keyCode: number;
  readonly which: number;
  constructor(type, readonly originalEvent: KeyboardEvent) {
    super(type);
    Object.assign(this, {
      which : originalEvent.which,
      keyCode: originalEvent.keyCode
    });
  }

  preventDefault() {
    this.originalEvent.preventDefault();
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

export const PASTE = "paste";
export class PasteAction extends Action {
  constructor(readonly item: DataTransferItem) {
    super(PASTE);
  }
}

export const DELETE_SELECTION = "deleteSelection";
export class DeleteSelectionAction extends Action {
  constructor() {
    super(DELETE_SELECTION);
  }
}

export const SET_TOOL = "setTool";
export class SetToolAction extends Action {
  constructor(readonly tool: IActor) {
    super(SET_TOOL);
  }
}