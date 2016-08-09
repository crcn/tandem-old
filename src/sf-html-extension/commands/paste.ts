import { IActor } from "sf-core/actors";
import { FrontEndApplication } from "sf-front-end/application";
import { SfFile } from "../active-records/sf-file";
import { HTMLFragmentExpression } from "../parsers/html/expressions";
import { parse as parseHTML } from "../parsers/html";
import { CommandFactoryDependency, APPLICATION_SINGLETON_NS, IInjectable } from "sf-core/dependencies";
import { PasteAction, PASTE } from "sf-front-end/actions";
import * as sift from "sift";
import { inject } from "sf-core/decorators";

export class PasteHTMLCommand implements IActor, IInjectable {

  @inject(APPLICATION_SINGLETON_NS)
  readonly app: FrontEndApplication;

  didInject() { }
  execute(action: PasteAction) {

    // TODO - need to paste to editor.focus (entity)
    action.item.getAsString((content) => {

      // meta charset is tacked on the beginning - remove it
      content = content.replace(/\<meta.*?\>/, "");

      (<HTMLFragmentExpression>(<SfFile>this.app.editor.file).entity.expression).childNodes.push(
        ...(<HTMLFragmentExpression>parseHTML(content)).childNodes
      );

      this.app.editor.file.save();
    });
  }
}

export const dependency = new CommandFactoryDependency(sift({ type: PASTE, "item.type": "text/html" }), PasteHTMLCommand);

