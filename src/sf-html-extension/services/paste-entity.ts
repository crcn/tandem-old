import * as sift from "sift";
import { flatten } from "lodash";
import { HTMLFile } from "../models/html-file";
import { filterAction } from "sf-core/decorators";
import { HTML_MIME_TYPE } from "sf-html-extension/constants";
import { parse as parseHTML } from "../parsers/html";
import { FrontEndApplication } from "sf-front-end/application";
import { findEntitiesBySource } from "sf-core/entities";
import { BaseApplicationService } from "sf-core/services";
import { PASTE, PasteAction, SelectAction } from "sf-front-end/actions";

import {
  IInjectable,
  APPLICATION_SINGLETON_NS,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "sf-core/dependencies";

export class PasteHTMLService extends BaseApplicationService<FrontEndApplication> {

  @filterAction(sift({ type: PASTE, "item.type": HTML_MIME_TYPE }))
  execute(action: PasteAction) {

    // TODO - need to paste to editor.focus (entity)
    action.item.getAsString(async (content) => {

      const workspace = this.app.workspace;
      const file = <HTMLFile>workspace.file;
      const activeEntity = workspace.selection.length ? workspace.selection[0].parentNode : file.document.root;

      // meta charset is tacked on the beginning - remove it
      content = content.replace(/\<meta.*?\>/, "");

      // TODO - this.app.workspace.activeEntity.source.appendChildNodes()
      const childNodes = parseHTML(content).childNodes;
      activeEntity.source.appendChildNodes(
        ...childNodes
      );

      // entity may be within a different file
      await activeEntity.document.file.save();

      // TODO - SelectExpressionAction
      this.app.bus.execute(new SelectAction(flatten(childNodes.map((expression) => findEntitiesBySource(activeEntity, expression)))));
    });
  }
}

export const dependency = new ApplicationServiceDependency("paste-html-entity", PasteHTMLService);

