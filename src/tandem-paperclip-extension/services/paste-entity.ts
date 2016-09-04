import * as sift from "sift";
import { MimeTypes } from "tandem-paperclip-extension/constants";
import { filterAction } from "tandem-common/decorators";
import { PasteHTMLEntityAction } from "tandem-html-extension/actions";
import { PasteAction } from "tandem-front-end/actions";
import { FrontEndApplication } from "tandem-front-end/application";
import { BaseApplicationService } from "tandem-common/services";
import { ApplicationServiceDependency } from "tandem-common/dependencies";

export class PastePCService extends BaseApplicationService<FrontEndApplication> {
  @filterAction(sift({ "item.type": MimeTypes.PC_MIME_TYPE }))
  [PasteAction.PASTE](action: PasteAction) {
    this.bus.execute(new PasteHTMLEntityAction(action.item));
  }
}

export const dependency = new ApplicationServiceDependency("paste-pc-entity", PastePCService);

