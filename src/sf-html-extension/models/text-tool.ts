
import { inject } from "sf-core/decorators";
import { MouseAction } from "sf-front-end/actions";
import { IApplication } from "sf-core/application";
import { SetToolAction } from "sf-front-end/actions";
import { parse as parseHTML } from "../parsers/html";
import { FrontEndApplication } from "sf-front-end/application";
import { HTMLElementExpression } from "../parsers/html/expressions";
import { BaseApplicationService } from "sf-core/services";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { IEditorTool, BaseEditorTool } from "sf-front-end/models";
import {
  Dependencies,
  DEPENDENCIES_NS,
  EntityFactoryDependency,
  ApplicationServiceDependency
} from "sf-core/dependencies";

/*
const editor = new HTMLEditor();
editor.open(new HTMLFile());
*/

export class TextTool extends BaseEditorTool {

  name = "text";
  cursor = "text";

  canvasMouseDown(action: MouseAction) {
    const position = this.editor.transform.localizePosition({
      left: action.originalEvent.pageX,
      top: action.originalEvent.pageY
    });

    const textSource = `<span style="position:absolute;left:${position.left}px;top:${position.top}px;">Type something</span>`;

    const file = this.editor.workspace.file;
    (<HTMLElementExpression>file.entity.source).childNodes.push(parseHTML(textSource));
    file.save();
  }
}

export const dependency = new EditorToolFactoryDependency("text", "text", "display", TextTool);