import * as sift from "sift";
import { IActor } from "sf-core/actors";
import { flatten } from "lodash";
import { HTMLFile } from "../models/html-file";
import { parse as parseHTML } from "../parsers/html";
import { FrontEndApplication } from "sf-front-end/application";
import { inject, filterAction } from "sf-core/decorators";
import { findEntitiesBySource } from "sf-core/entities";
import { HTMLFragmentExpression } from "../parsers/html";
import { PASTE, PasteAction, SelectAction } from "sf-front-end/actions";

import {
  IInjectable,
  APPLICATION_SINGLETON_NS,
  CommandFactoryDependency,
  ApplicationServiceDependency,
} from "sf-core/dependencies";

export class PasteHTMLCommand implements IActor, IInjectable {

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: FrontEndApplication;

  didInject() { }

  @filterAction(sift({ type: PASTE, "item.type": "text/html" }))
  execute(action: PasteAction) {

    // TODO - need to paste to editor.focus (entity)
    action.item.getAsString(async (content) => {

      const workspace = this.app.workspace;
      const file = <HTMLFile>workspace.file;
      const activeEntity = workspace.editor.activeEntity;

      // meta charset is tacked on the beginning - remove it
      content = content.replace(/\<meta.*?\>/, "");

      // TODO - this.app.workspace.activeEntity.source.appendChildNodes()
      const childNodes = parseHTML(content).childNodes;
      activeEntity.source.appendChildNodes(
        ...childNodes
      );

      // TODO - this.app.workspace.activeEntity.context.file.save(); - this is
      // necessary since since an entity can be composed of many other entities that
      // are sourced from other files.
      await file.save();

      this.app.bus.execute(new SelectAction(flatten(childNodes.map((expression) => findEntitiesBySource(activeEntity, expression))));
    });
  }
}

export const dependency = new ApplicationServiceDependency("paste-html-entity", PasteHTMLCommand);

