import { ZoomAction } from "sf-front-end/actions";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { FrontEndApplication } from "sf-front-end/application";

export class EditorService extends BaseApplicationService<FrontEndApplication> {
  zoom(action: ZoomAction) {
    this.app.editor.zoom += action.delta;
  }
}

export const dependency = new ApplicationServiceDependency("editor", EditorService);
