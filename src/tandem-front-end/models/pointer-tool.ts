import { IActor } from "tandem-common/actors";
import { inject } from "tandem-common/decorators";
import { BaseEditorTool } from "tandem-front-end/models";
import { FrontEndApplication } from "tandem-front-end/application";
import { POINTER_TOOL_KEY_CODE } from "tandem-front-end/constants";
import { VisibleEntityCollection } from "tandem-front-end/collections";
import { BaseApplicationService } from "tandem-common/services";
import { IInjectable, MAIN_BUS_NS } from "tandem-common/dependencies";
import { EditorToolFactoryDependency } from "tandem-front-end/dependencies";
import { ApplicationServiceDependency } from "tandem-common/dependencies";
import { SelectAction, MouseAction, KeyboardAction, RemoveSelectionAction } from "tandem-front-end/actions";

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
  }

  deleteSelection() {
    this.bus.execute(new RemoveSelectionAction());
  }
}

export const dependency = new EditorToolFactoryDependency("pointer", "cursor", "display", POINTER_TOOL_KEY_CODE, PointerTool);
