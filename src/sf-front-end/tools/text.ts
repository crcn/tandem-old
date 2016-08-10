import { FrontEndApplication } from "sf-front-end/application";
import { MouseAction } from "sf-front-end/actions";
import { ApplicationServiceDependency, DEPENDENCIES_NS, Dependencies, EntityFactoryDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { IApplication } from "sf-core/application";
import { SetToolAction } from "sf-front-end/actions";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { inject } from "sf-core/decorators";

/*
const editor = new HTMLEditor();
editor.open(new HTMLFile());
*/

export class TextTool extends BaseApplicationService<FrontEndApplication> {

  name = "text";
  cursor = "text";
  icon = "text";
  keyCommand = "t";

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  canvasMouseDown(action: MouseAction) {
    const textEntityFactory = EntityFactoryDependency.find("#text", this.dependencies);
    console.log("create text");
  }
}

export const dependency = new EditorToolFactoryDependency("text", TextTool);