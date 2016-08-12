import { FrontEndApplication } from "sf-front-end/application";
import { IEditorTool, BaseEditorTool } from "sf-front-end/models";
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

export class TextTool extends BaseEditorTool {

  name = "text";
  cursor = "text";

  canvasMouseDown(action: MouseAction) {
    const textSource = `<span style="position:absolute;left:${action.originalEvent.pageX}px;top:${action.originalEvent.pageY}px;">Type something</span>`;

    const file = this.editor.workspace.file;
    (<HTMLElementExpression>file.entity.source).childNodes.push(parseHTML(textSource));
    file.save();
  }
}

export const dependency = new EditorToolFactoryDependency("text", "text", "display", TextTool);