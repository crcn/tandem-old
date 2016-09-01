import * as sift from "sift";
import { flatten } from "lodash";
import { HTMLFile } from "../models/html-file";
import { parseHTML } from "../ast";
import { MimeTypes } from "sf-html-extension/constants";
import { filterAction } from "sf-core/decorators";
import { FrontEndApplication } from "sf-front-end/application";
import { appendSourceChildren } from "sf-core/ast/entities";
import { BaseApplicationService } from "sf-core/services";
import { VisibleEntityCollection } from "sf-front-end/collections";
import { PASTE, PasteAction, SelectAction } from "sf-front-end/actions";
import { PasteHTMLEntityAction, PASTE_HTML_ENTITY } from "sf-html-extension/actions";
import {
  IInjectable,
  APPLICATION_SINGLETON_NS,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "sf-core/dependencies";

export class PasteHTMLService extends BaseApplicationService<FrontEndApplication> {

  @filterAction(sift({ "item.type": MimeTypes.HTML_MIME_TYPE }))
  [PASTE](action: PasteAction) {
    this.bus.execute(new PasteHTMLEntityAction(action.item));
  }

  [PASTE_HTML_ENTITY](action: PasteAction) {

    // TODO - need to paste to editor.focus (entity)
    action.item.getAsString(async (content) => {

      const workspace = this.app.workspace;
      const file = <HTMLFile>workspace.file;

      const visibleEntities = new VisibleEntityCollection(...workspace.selection);

      const activeEntity = visibleEntities.length ? visibleEntities[0].parent : file.entity;

      // meta charset is tacked on the beginning - remove it
      content = content.replace(/\<meta.*?\>/, "");

      // TODO - SelectExpressionAction
      this.app.bus.execute(new SelectAction(await appendSourceChildren(activeEntity, ...parseHTML(content).children)));
    });
  }
}

export const dependency = new ApplicationServiceDependency("paste-html-entity", PasteHTMLService);

