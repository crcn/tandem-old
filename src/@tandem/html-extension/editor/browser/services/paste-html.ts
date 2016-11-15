import * as sift from "sift";
import { flatten } from "lodash";
import { HTML_MIME_TYPE } from "@tandem/common";
import { filterAction } from "@tandem/common/decorators";
import { PasteHTMLEntityAction } from "@tandem/html-extension/actions";
import { CoreApplicationService } from "@tandem/core";
import { PasteAction, SelectAction } from "@tandem/editor/browser/actions";
import {
  IInjectable,
  CommandFactoryProvider,
  ApplicationServiceProvider,
} from "@tandem/common";
import {
  parseMarkup
} from "@tandem/synthetic-browser";

export class PasteHTMLService extends CoreApplicationService<any> {

  @filterAction(sift({ "item.type": HTML_MIME_TYPE }))
  [PasteAction.PASTE](action: PasteAction) {
    this.bus.dispatch(new PasteHTMLEntityAction(action.item));
  }

  [PasteHTMLEntityAction.PASTE_HTML_ENTITY](action: PasteHTMLEntityAction) {

  }
}

// export const pastHTMLServiceProvider = new ApplicationServiceProvider("paste-html-entity", PasteHTMLService);

