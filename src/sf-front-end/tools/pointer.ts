import { IActor } from "sf-core/actors";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectAction, MouseAction, KeyboardAction } from "sf-front-end/actions";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { DisplayEntityCollection } from "sf-front-end/selection";

// TODO - everything here should just be a command

export default class PointerTool extends BaseApplicationService<FrontEndApplication> {

  name = "pointer";
  main = true;
  icon = "cursor";

  canvasMouseDown(action: MouseAction) {
    this.bus.execute(new SelectAction());
  }

  canvasKeyDown(action: KeyboardAction) {
    action.preventDefault();

    const selection = <DisplayEntityCollection>this.app.editor.selection;
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
      return;
    }

    selection.display.position = { left, top };
  }

  deleteSelection() {
    this.app.editor.selection.dispose();
    this.app.editor.file.save();
  }
}

export const dependency = new EditorToolFactoryDependency("pointer", PointerTool);
