import { IActor } from "sf-core/actors";
import { BaseEditorTool } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectAction, MouseAction, KeyboardAction } from "sf-front-end/actions";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { DisplayEntitySelection } from "sf-front-end/models";
import { IInjectable, MAIN_BUS_NS } from "sf-core/dependencies";
import { inject } from "sf-core/decorators";

// TODO - everything here should just be a command

export default class PointerTool extends BaseEditorTool implements IInjectable {

  name = "pointer";

  @inject(MAIN_BUS_NS)
  readonly bus: IActor;

  didInject() {

  }

  canvasMouseDown(action: MouseAction) {
    this.bus.execute(new SelectAction());
  }

  canvasKeyDown(action: KeyboardAction) {

    const selection = <DisplayEntitySelection>this.editor.workspace.selection;
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
      return;
    }

    action.preventDefault();

    selection.display.position = { left, top };
    this.workspace.file.save();
  }

  deleteSelection() {
    this.workspace.selection.dispose();
    this.workspace.file.save();
  }
}

export const dependency = new EditorToolFactoryDependency("pointer", "cursor", "display", PointerTool);
