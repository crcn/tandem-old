import { IActor } from "sf-core/actors";
import { FrontEndApplication } from "sf-front-end/application";
import { SfFile } from "../models/sf-file";
import { HTMLFragmentExpression } from "../parsers/html/expressions";
import { parse as parseHTML } from "../parsers/html";
import { CommandFactoryDependency, ApplicationServiceDependency, APPLICATION_SINGLETON_NS, IInjectable } from "sf-core/dependencies";
import { PasteAction, PASTE } from "sf-front-end/actions";
import * as sift from "sift";
import { inject, filterAction } from "sf-core/decorators";

export class PasteHTMLCommand implements IActor, IInjectable {

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: FrontEndApplication;

  didInject() { }

  @filterAction(sift({ type: PASTE, "item.type": "text/html" }))
  execute(action: PasteAction) {

    // TODO - need to paste to editor.focus (entity)
    action.item.getAsString((content) => {

      // meta charset is tacked on the beginning - remove it
      content = content.replace(/\<meta.*?\>/, "");

      // TODO - this.app.workspace.activeEntity.source.appendChildNodes()
      (<SfFile>this.app.workspace.file).entity.source.appendChildNodes(
        ...parseHTML(content).childNodes
      );

      // TODO - this.app.workspace.activeEntity.context.file.save(); - this is
      // necessary since since an entity can be composed of many other entities that
      // are sourced from other files.
      this.app.workspace.file.save();
    });
  }
}

export const dependency = new ApplicationServiceDependency("paste-html-entity", PasteHTMLCommand);

