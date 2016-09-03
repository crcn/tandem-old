import * as sift from "sift";
import { MimeTypes } from "sf-paperclip-extension/constants";
import { filterAction } from "sf-common/decorators";
import { PasteHTMLEntityAction } from "sf-html-extension/actions";
import { PASTE, PasteAction } from "sf-front-end/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-common/services";
import { ApplicationServiceDependency } from "sf-common/dependencies";

export class PastePCService extends BaseApplicationService<FrontEndApplication> {
  @filterAction(sift({ "item.type": MimeTypes.PC_MIME_TYPE }))
  [PASTE](action: PasteAction) {
    this.bus.execute(new PasteHTMLEntityAction(action.item));
  }
}

export const dependency = new ApplicationServiceDependency("paste-pc-entity", PastePCService);

