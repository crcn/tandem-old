import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import { BaseEditorTool } from "@tandem/editor/models";
import { FrontEndApplication } from "@tandem/editor/application";
import { POINTER_TOOL_KEY_CODE } from "@tandem/editor/constants";
import { VisibleDOMEntityCollection } from "@tandem/editor/collections";
import { BaseApplicationService } from "@tandem/common/services";
import { EditorToolFactoryDependency } from "@tandem/editor/dependencies";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";
import { IInjectable, MainBusDependency } from "@tandem/common/dependencies";
import { SelectAction, MouseAction, KeyboardAction, RemoveSelectionAction } from "@tandem/editor/actions";

// TODO - everything here should just be a command

export class PointerTool extends BaseEditorTool implements IInjectable {

  name = "pointer";

  @inject(MainBusDependency.NS)
  readonly bus: IActor;

  canvasMouseDown(action: MouseAction) {
    this.bus.execute(new SelectAction());
  }

  canvasKeyDown(action: KeyboardAction) {

    // const selection = new VisibleDOMEntityCollection(...this.editor.selection);
    // if (selection.length) return;

    // if (selection["display"] == null) return;

    // const bounds = selection.display.bounds;

    // let left = bounds.left;
    // let top  = bounds.top;

    // if (action.keyCode === 38) {
    //   top--;
    // } else if (action.keyCode === 40) {
    //   top++;
    // } else if (action.keyCode === 37) {
    //   left--;
    // } else if (action.keyCode === 39) {
    //   left++;
    // } else {

    //   // deselect all when escape key is hit
    //   if (action.keyCode === 27) {
    //     this.bus.execute(new SelectAction());
    //   }

    //   return;
    // }

    // action.preventDefault();

    // selection.display.position = { left, top };
  }

  deleteSelection() {
    this.bus.execute(new RemoveSelectionAction());
  }
}

export const pointerToolDependency = new EditorToolFactoryDependency("pointer", "cursor", "display", POINTER_TOOL_KEY_CODE, PointerTool);
