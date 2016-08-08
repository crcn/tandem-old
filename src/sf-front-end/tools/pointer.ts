import { IActor } from "sf-core/actors";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectAction } from "sf-front-end/actions";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";

export default class PointerTool extends BaseApplicationService<FrontEndApplication> {

  name = "pointer";
  main = true;
  icon = "cursor";

  stageCanvasMouseDown() {
    this.bus.execute(new SelectAction());
  }

  deleteSelection() {
    this.app.editor.selection.dispose();
  }
}

export const dependency = new EditorToolFactoryDependency("pointer", PointerTool);
