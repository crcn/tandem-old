import { loggable } from "sf-core/decorators";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency } from "sf-core/dependencies";

@loggable()
export default class HistoryService extends BaseApplicationService<FrontEndApplication> {

  undo() {
  }

  redo() {
  }

  addHistory(action) {

  }
}

export const dependency = new ApplicationServiceDependency("history", HistoryService);