import { IActor } from "sf-common/actors";
import { inject } from "sf-common/decorators";
import { BaseEditorTool } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { POINTER_TOOL_KEY_CODE } from "sf-front-end/constants";
import { VisibleEntityCollection } from "sf-front-end/collections";
import { BaseApplicationService } from "sf-common/services";
import { IInjectable, MAIN_BUS_NS } from "sf-common/dependencies";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { ApplicationServiceDependency } from "sf-common/dependencies";
import { SelectAction, MouseAction, KeyboardAction, RemoveSelectionAction } from "sf-front-end/actions";

// TODO - everything here should just be a command

export class PointerTool extends BaseEditorTool implements IInjectable {

  name = "pointer";

  @inject(MAIN_BUS_NS)
  readonly bus: IActor;

  canvasMouseDown(action: MouseAction) {
    this.bus.execute(new SelectAction());
  }

  canvasKeyDown(action: KeyboardAction) {

    const selection = new VisibleEntityCollection(...this.editor.workspace.selection);
    if (selection.length) return;

    if (selection["display"] == null) return;

    const bounds = selection.display.bounds;

    let left = bounds.left;
    let top  = bounds.top;

    if (action.keyCode === 38) {
      top--;
    } else if (action.keyCode === 40) {
      top++;
    } else if (action.keyCode === 37) {
      left--;
    } else if (action.keyCode === 39) {
      left++;
    } else {

      // deselect all when escape key is hit
      if (action.keyCode === 27) {
        this.bus.execute(new SelectAction());
      }

      return;
    }

    action.preventDefault();

    selection.display.position = { left, top };
    this.workspace.file.update();
  }

  deleteSelection() {
    this.workspace.file.update();
    this.bus.execute(new RemoveSelectionAction());
  }
}

export const dependency = new EditorToolFactoryDependency("pointer", "cursor", "display", POINTER_TOOL_KEY_CODE, PointerTool);
