import { IActor } from "sf-core/actors";
import { IApplication } from "sf-core/application";
import { SelectAction } from "sf-front-end/actions";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";

export default class PointerTool extends BaseApplicationService<IApplication> {

  name = "pointer";
  main = true;
  icon = "cursor";

  stageCanvasMouseDown() {
    this.bus.execute(new SelectAction());
  }
}

export const dependency = new EditorToolFactoryDependency("pointer", PointerTool);
