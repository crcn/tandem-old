import { FrontEndApplication } from "sf-front-end/application";
import { PasteAction } from "sf-front-end/actions";
import { IActor } from "sf-core/actors";
import * as sift from "sift";
import { filterAction } from "sf-core/decorators";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";

export class PasteEntityService extends BaseApplicationService<FrontEndApplication> {

  @filterAction(sift({ "item.type": "text/x-entity" }))
  paste(action: PasteAction) {
    action.item.getAsString((content) => {
      this._paste(content);
    });
  }

  _paste(content: string) {
    console.log("paste ", content);
  }
}

export const dependency = new ApplicationServiceDependency("pasteEntity", PasteEntityService);


