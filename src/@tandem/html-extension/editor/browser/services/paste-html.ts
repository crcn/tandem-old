import * as sift from "sift";
import { flatten } from "lodash";
import { HTML_MIME_TYPE } from "@tandem/common";
import { filterMessage } from "@tandem/common/decorators";
import { PasteHTMLEntityAction } from "@tandem/html-extension/messages";
import { CoreApplicationService } from "@tandem/core";
import { PasteRequest, SelectRequest } from "@tandem/editor/browser/messages";
import {
  IInjectable,
  CommandFactoryProvider,
  ApplicationServiceProvider,
} from "@tandem/common";
import {
  parseMarkup
} from "@tandem/synthetic-browser";

export class PasteHTMLService extends CoreApplicationService<any> {

  @filterMessage(sift({ "item.type": HTML_MIME_TYPE }))
  [PasteRequest.PASTE](action: PasteRequest) {
    this.bus.dispatch(new PasteHTMLEntityAction(action.item));
  }

  [PasteHTMLEntityAction.PASTE_HTML_ENTITY](action: PasteHTMLEntityAction) {

  }
}

// export const pastHTMLServiceProvider = new ApplicationServiceProvider("paste-html-entity", PasteHTMLService);

