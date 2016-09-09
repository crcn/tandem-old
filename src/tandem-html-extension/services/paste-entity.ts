import * as sift from "sift";
import { flatten } from "lodash";
import { HTMLFile } from "../models/html-file";
import { parseHTML } from "../ast";
import { MimeTypes } from "tandem-html-extension/constants";
import { filterAction } from "tandem-common/decorators";
import { FrontEndApplication } from "tandem-front-end/application";
import { appendSourceChildren } from "tandem-common/ast/entities";
import { PasteHTMLEntityAction } from "tandem-html-extension/actions";
import { BaseApplicationService } from "tandem-common/services";
import { VisibleEntityCollection } from "tandem-front-end/collections";
import { PasteAction, SelectAction } from "tandem-front-end/actions";
import {
  IInjectable,
  APPLICATION_SINGLETON_NS,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "tandem-common/dependencies";

export class PasteHTMLService extends BaseApplicationService<FrontEndApplication> {

  @filterAction(sift({ "item.type": MimeTypes.HTML }))
  [PasteAction.PASTE](action: PasteAction) {
    this.bus.execute(new PasteHTMLEntityAction(action.item));
  }

  [PasteHTMLEntityAction.PASTE_HTML_ENTITY](action: PasteHTMLEntityAction) {

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

export const pastHTMLServiceDependency = new ApplicationServiceDependency("paste-html-entity", PasteHTMLService);

