import Url =  require("url");
import { uniq } from "lodash";
import { toArray } from "@tandem/common/utils/array";
import { IMessage } from "@tandem/mesh";
import { CoreEvent } from "@tandem/common/messages";
import { EditorRouteNames } from "@tandem/editor/browser/constants";
import { IRange, IPoint } from "@tandem/common/geom";
import { ISyntheticObject } from "@tandem/sandbox";
import { WorkspaceToolFactoryProvider } from "@tandem/editor/browser/providers";
import { File, serialize, deserialize, LogLevel } from "@tandem/common";
import { Workspace, IWorkspaceTool, IHistoryItem, IRouterState } from "@tandem/editor/browser/stores";

export class MouseAction extends CoreEvent {

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

export class AlertMessage extends CoreEvent {
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

export class KeyboardAction extends CoreEvent {

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

export class SelectRequest extends CoreEvent {

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

export class RedirectRequest implements IMessage {
  static readonly REDIRECT = "redirect";
  readonly type = RedirectRequest.REDIRECT;
  constructor(readonly routeNameOrPath: string, readonly params?: any, readonly query?: any) {

  }

  static fromURL(value: string) {
    const parts = Url.parse(value, true);
    return new RedirectRequest(parts.pathname, {}, parts.query);
  }
}

export class DidRedirectMessage implements IMessage {
  static readonly DID_REDIRECT = "didRedirect";
  readonly type = DidRedirectMessage.DID_REDIRECT;
  constructor(readonly pathname: string, readonly state: IRouterState) {
    
  }
}

export function createWorkspaceRedirectRequest(uri: string) {
  return new RedirectRequest(EditorRouteNames.WORKSPACE, {}, { workspaceUri: uri });
}

export class SelectionChangeEvent extends CoreEvent {
  static readonly SELECTION_CHANGE = "selectionChange";
  constructor(readonly items: any[] = []) {
    super(SelectionChangeEvent.SELECTION_CHANGE);
  }
}

export class SelectAllRequest extends CoreEvent {
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

export class ZoomRequest extends CoreEvent {
  static readonly ZOOM = "zoom";
  constructor(readonly delta: number, readonly ease: boolean = false, readonly round: boolean = false) {
    super(ZoomRequest.ZOOM);
  }
}

export class ZoomInRequest extends CoreEvent {
  static readonly ZOOM_IN = "zoomIn";
  constructor() {
    super(ZoomInRequest.ZOOM_IN);
  }
}

export class ToggleSettingRequest extends CoreEvent {
  static readonly TOGGLE_SETTING = "toggleSetting";
  constructor(readonly settingName: string) {
    super(ToggleSettingRequest.TOGGLE_SETTING);
  }
}

export function createToggleSettingRequestClass(settingName: string): { new(): ToggleSettingRequest } {
  return class extends ToggleSettingRequest {
    constructor() {
      super(settingName);
    }
  }
} 

export class ToggleStageToolsRequest extends CoreEvent {
  static readonly TOGGLE_STAGE_TOOLS = "toggleStageTools";
  constructor() {
    super(ToggleStageToolsRequest.TOGGLE_STAGE_TOOLS);
  }
}

export class ZoomOutRequest extends CoreEvent {
  static readonly ZOOM_OUT = "zoomOut";
  constructor() {
    super(ZoomOutRequest.ZOOM_OUT);
  }
}

export class SetZoomRequest extends CoreEvent {
  static readonly SET_ZOOM = "setZoom";
  constructor(readonly value: number, readonly ease: boolean = false) {
    super(SetZoomRequest.SET_ZOOM);
  }
}

export class PasteRequest extends CoreEvent {
  constructor(readonly item: DataTransferItem) {
    super(PasteRequest.getRequestType(item));
  }

  static getRequestType(item: DataTransferItem | string) {
    return ["paste", typeof item === "string" ? item : item.type].join("/");
  }
}

export class SetToolRequest extends CoreEvent {
  static readonly SET_TOOL = "setTool";
  constructor(readonly toolFactory: { create(workspace: Workspace): IWorkspaceTool }) {
    super(SetToolRequest.SET_TOOL);
  }
}

export class AddSyntheticObjectRequest implements IMessage {
  static readonly ADD_SYNTHETIC_OBJECT = "addSyntheticObject";
  readonly type = AddSyntheticObjectRequest.ADD_SYNTHETIC_OBJECT;
  constructor(readonly item: ISyntheticObject) {
    
  }
}

export class KeyCommandEvent extends CoreEvent {
  static readonly KEY_COMMAND = "keyCommand";
  constructor(readonly combo: string) {
    super(KeyCommandEvent.KEY_COMMAND);
  }
}

export class RemoveSelectionRequest extends CoreEvent {
  static readonly REMOVE_SELECTION = "removeSelection";
  constructor() {
    super(RemoveSelectionRequest.REMOVE_SELECTION);
  }
}

export * from "../../common/messages";