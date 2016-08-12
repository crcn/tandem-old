import { FrontEndApplication } from "sf-front-end/application";
import { MouseAction } from "sf-front-end/actions";
import { ApplicationServiceDependency, DEPENDENCIES_NS, Dependencies, EntityFactoryDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { IApplication } from "sf-core/application";
import { SetToolAction } from "sf-front-end/actions";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { inject } from "sf-core/decorators";
import { parse as parseHTML } from "../parsers/html";
import { HTMLElementExpression } from "../parsers/html/expressions";

/*
const editor = new HTMLEditor();
editor.open(new HTMLFile());
*/

export class TextTool extends BaseApplicationService<FrontEndApplication> {

  name = "text";
  cursor = "text";
  icon = "text";
  keyCommand = "t";

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  canvasMouseDown(action: MouseAction) {
    const textSource = `<span style="position:absolute;left:${action.originalEvent.pageX}px;top:${action.originalEvent.pageY}px;">Type something</span>`;

    const file = this.app.editor.file;
    (<HTMLElementExpression>file.entity.expression).childNodes.push(parseHTML(textSource));
    file.save();
  }
}

export const dependency = new EditorToolFactoryDependency("text", TextTool);