import { uniq } from "lodash";
import { toArray } from "@tandem/common/utils/array";
import { IRange, IPoint } from "@tandem/common/geom";
import { ISyntheticObject } from "@tandem/sandbox";
import { Action } from "@tandem/common/actions";
import { File, serialize, deserialize, LogLevel } from "@tandem/common";
import { Workspace, IWorkspaceTool, IHistoryItem } from "@tandem/editor/browser/models";
import { WorkspaceToolFactoryProvider } from "@tandem/editor/browser/providers";

export class MouseAction extends Action {

  static readonly CANVAS_MOUSE_DOWN = "canvasMouseDown";
  static readonly SELECTION_DOUBLE_CLICK = "selectionDoubleClick";

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

export class AlertMessage extends Action {
  static readonly ALERT = "alert";
  constructor(type: string, readonly level: LogLevel, readonly text: string) {
    super(type);
  }

  static createWarningMessage(text: string) {
    return new AlertMessage(this.ALERT, LogLevel.WARNING, text);
  }

  static createErrorMessage(text: string) {
    return new AlertMessage(this.ALERT, LogLevel.ERROR, text);
  }
}

export class KeyboardAction extends Action {

  static readonly CANVAS_KEY_DOWN = "canvasKeyDown";

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

export class SelectRequest extends Action {

  static readonly SELECT = "SELECT";

  public items: Array<any>;
  public keepPreviousSelection: boolean;
  public toggle: boolean;

  constructor(items: any = undefined, keepPreviousSelection = false, toggle = false) {
    super(SelectRequest.SELECT);
    this.items = toArray(items);
    this.keepPreviousSelection = !!keepPreviousSelection;
    this.toggle = toggle;
  }
}

export class SelectionChangeEvent extends Action {

  static readonly SELECTION_CHANGE = "selectionChange";
  constructor(readonly items: any[] = []) {
    super(SelectionChangeEvent.SELECTION_CHANGE);
  }
}

export class SelectAllRequest extends Action {
  static readonly SELECT_ALL = "selectAll";
  constructor() {
    super(SelectAllRequest.SELECT_ALL);
  }
}

export class ToggleSelectRequest extends SelectRequest {
  constructor(items = undefined, keepPreviousSelection: boolean = false) {
    super(items, keepPreviousSelection, true);
  }
}

export class ZoomRequest extends Action {
  static readonly ZOOM = "zoom";
  constructor(readonly delta: number, readonly ease: boolean = false) {
    super(ZoomRequest.ZOOM);
  }
}

export class SetZoomRequest extends Action {
  static readonly SET_ZOOM = "setZoom";
  constructor(readonly value: number, readonly ease: boolean = false) {
    super(SetZoomRequest.SET_ZOOM);
  }
}

export class PasteRequest extends Action {
  static readonly PASTE = "paste";
  constructor(readonly item: DataTransferItem) {
    super(PasteRequest.PASTE);
  }
}

export class DeleteSelectionRequest extends Action {
  static readonly DELETE_SELECTION = "deleteSelection";
  constructor() {
    super(DeleteSelectionRequest.DELETE_SELECTION);
  }
}

export class SetToolRequest extends Action {
  static readonly SET_TOOL = "setTool";
  constructor(readonly toolFactory: { create(workspace: Workspace): IWorkspaceTool }) {
    super(SetToolRequest.SET_TOOL);
  }
}

export class KeyCommandAction extends Action {
  static readonly KEY_COMMAND = "keyCommand";
  constructor(readonly combo: string) {
    super(KeyCommandAction.KEY_COMMAND);
  }
}

export class RemoveSelectionAction extends Action {
  static readonly REMOVE_SELECTION = "removeSelection";
  constructor() {
    super(RemoveSelectionAction.REMOVE_SELECTION);
  }
}


export class DocumentFileAction extends Action {
  static readonly LOADED = "loaded";
  constructor(readonly type: string) {
    super(type);
  }
}

export * from "../../common/messages";