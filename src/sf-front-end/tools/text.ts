import { ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { IApplication } from "sf-core/application";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";

export class TextTool extends BaseApplicationService<IApplication> {

  name = "text";
  cursor = "text";
  icon = "text";
  execute() {
  }
}

export const dependency = new EditorToolFactoryDependency("text", TextTool);