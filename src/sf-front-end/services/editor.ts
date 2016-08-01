import { ZOOM_IN } from "sf-front-end/actions";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { FrontEndApplication } from "sf-front-end/application";

const ZOOM_INCREMENT = 0.1;

export class EditorService extends BaseApplicationService<FrontEndApplication> {
  zoomIn() {
    this.app.editor.zoom += ZOOM_INCREMENT;
  }
  zoomOut() {
    this.app.editor.zoom -= ZOOM_INCREMENT;
  }
}

export const dependency = new ApplicationServiceDependency("editor", EditorService);
