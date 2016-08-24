
import { inject } from "sf-core/decorators";
import { IActor } from "sf-core/actors";
import { InsertTool } from "sf-front-end/models/insert-tool";
import { MouseAction } from "sf-front-end/actions";
import { IApplication } from "sf-core/application";
import { SetToolAction } from "sf-front-end/actions";
import { parse as parseHTML } from "../parsers/html";
import { FrontEndApplication } from "sf-front-end/application";
import { HTMLElementExpression } from "../parsers/html";
import { BaseApplicationService } from "sf-core/services";
import { VisibleHTMLElementEntity } from "sf-html-extension/models";
import { EditorToolFactoryDependency } from "sf-front-end/dependencies";
import { dependency as pointerToolDependency } from "sf-front-end/models/pointer-tool";
import { IEditorTool, BaseEditorTool, IEditor } from "sf-front-end/models";
import {
  Dependency,
  MAIN_BUS_NS,
  Dependencies,
  DEPENDENCIES_NS,
  EntityFactoryDependency,
  ApplicationServiceDependency,
} from "sf-core/dependencies";

/*
const editor = new HTMLEditor();
editor.open(new HTMLFile());
*/

export class TextTool extends BaseEditorTool {

  @inject(MAIN_BUS_NS)
  readonly bus: IActor;

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  private _startChildNodes: Array<any>;
  private _disposed: boolean;

  name = "text";
  cursor = null;

  constructor(editor: IEditor) {
    super(editor);
    this._startEditing();
  }

  private _startEditing() {
    const element = this._targetNode;
    this._startChildNodes = Array.prototype.slice.call(element.childNodes);
    element.setAttribute("contenteditable", "true");
    element.addEventListener("keydown", this._onKeyDown);
    // element.addEventListener("keypress", (event) => event.preventDefault());
    element.focus();

    // some async stuff is preventing the element
    // from being selected, so add a timeout for now.
    setTimeout(() => {
      element.ownerDocument.execCommand("selectAll", false, null);
    }, 10);
  }

  private _onKeyDown = (event: KeyboardEvent) => {

    // janky as hell, but this is a fairly simple approach to prevent
    //  auto body scrolling for inputs. We don't want that since it
    // conflicts with out paning tool.
    requestAnimationFrame(() => {
      this._targetNode.ownerDocument.body.scrollLeft = 0;
      this._targetNode.ownerDocument.body.scrollTop  = 0;
    });
  }

  private get _targetEntity() {
    return <VisibleHTMLElementEntity>this.workspace.selection[0];
  }

  private get _targetNode() {
    return <HTMLSpanElement><any>this._targetEntity.section.targetNode;
  }

  public dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._targetNode.setAttribute("contenteditable", "false");
    this._targetNode.removeEventListener("keydown", this._onKeyDown);

    // parse the innerHTML, set the source content, and prepare to diff
    this._targetEntity.source.childNodes = parseHTML(this._targetNode.innerHTML).childNodes;

    // need to reset the display HTML to what it was before so that
    // it can be properly diff'd
    this._targetNode.innerHTML = "";
    for (const child of this._startChildNodes) {
      this._targetNode.appendChild(child);
    }

    // save the workspae file -- diffing time
    this.workspace.file.save();
    this.bus.execute(new SetToolAction(<EditorToolFactoryDependency>this.dependencies.query(pointerToolDependency.ns)));
  }

  public canvasMouseDown(event: MouseAction) {
    if (event.originalEvent.target === this._targetNode) return;
    this.dispose();
  }
}

class InsertTextTool extends InsertTool {
  readonly cursor: string = "text";
  readonly resizable: boolean = false;

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  get displayEntityToolFactory() {
    return <EditorToolFactoryDependency>this._dependencies.link(new EditorToolFactoryDependency(null, null, null, TextTool));
  }

  createSource() {
    return parseHTML(`<span style="position:absolute;white-space: nowrap;">Type Something</span>`).childNodes[0];
  }
}

export const dependency = new EditorToolFactoryDependency("text", "text", "display", InsertTextTool);