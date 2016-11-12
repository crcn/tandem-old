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
    this.bus.execute(new PasteHTMLEntityAction(action.item));
  }

  [PasteHTMLEntityAction.PASTE_HTML_ENTITY](action: PasteHTMLEntityAction) {

    // // TODO - need to paste to editor.focus (entity)
    // action.item.getAsString(async (content) => {

    //   const workspace = this.app.workspace;
    //   const file = <HTMLFile>workspace.file;

    //   const visibleEntities = new VisibleDOMEntityCollection(...workspace.selection);

    //   const activeEntity = visibleEntities.length ? visibleEntities[0].parent : file.entity;

    //   // meta charset is tacked on the beginning - remove it
    //   content = content.replace(/\<meta.*?\>/, "");

    //   // TODO - SelectExpressionAction
    //   this.app.bus.execute(new SelectAction(await appendSourceChildren(activeEntity, ...parseMarkup(content).children)));
    // });
  }
}

// export const pastHTMLServiceProvider = new ApplicationServiceProvider("paste-html-entity", PasteHTMLService);

