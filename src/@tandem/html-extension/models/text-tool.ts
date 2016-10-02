
import { inject } from "@tandem/common/decorators";
import { IActor } from "@tandem/common/actors";
import { InsertTool } from "@tandem/front-end/models/insert-tool";
import { MouseAction } from "@tandem/front-end/actions";
import { IApplication } from "@tandem/common/application";
import { SetToolAction } from "@tandem/front-end/actions";
import { TEXT_TOOL_KEY_CODE } from "@tandem/html-extension/constants";
import { FrontEndApplication } from "@tandem/front-end/application";
import { pointerToolDependency } from "@tandem/front-end/models/pointer-tool";
import { BaseApplicationService } from "@tandem/common/services";
import { EditorToolFactoryDependency } from "@tandem/front-end/dependencies";
import { IEditorTool, BaseEditorTool, IEditor } from "@tandem/front-end/models";
import { parseHTML, HTMLElementExpression , VisibleHTMLElementEntity } from "../lang";
import {
  Dependency,
  MAIN_BUS_NS,
  Dependencies,
  DEPENDENCIES_NS,
  EntityFactoryDependency,
  ApplicationServiceDependency,
} from "@tandem/common/dependencies";

/*
const editor = new HTMLEditor();
editor.open(new HTMLFile());
*/

export class EditInnerHTMLTool extends BaseEditorTool {

  @inject(MAIN_BUS_NS)
  readonly bus: IActor;

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  private _disposed: boolean;

  name = "text";
  cursor = null;

  constructor(editor: IEditor) {
    super(editor);
    this._startEditing();
  }

  private _startEditing() {
    const element = this._targetNode;
    element.setAttribute("contenteditable", "true");
    element.addEventListener("keydown", this._onKeyDown);

    // some async stuff is preventing the element
    // from being selected, so add a timeout for now.
    setTimeout(() => {
      element.focus();
      element.ownerDocument.execCommand("selectAll", false, null);
    }, 100);
  }

  private _onKeyDown = (event: KeyboardEvent) => {

    if (event.which === 27) {
      this.dispose();
    }

    // janky as hell, but this is a fairly simple approach to prevent
    //  auto body scrolling for inputs. We don't want that since it
    // conflicts with out paning tool.
    requestAnimationFrame(() => {
      this._targetNode.ownerDocument.body.scrollLeft = 0;
      this._targetNode.ownerDocument.body.scrollTop  = 0;
    });
  }

  private get _targetEntity() {
    return <VisibleHTMLElementEntity>this.editor.selection[0];
  }

  private get _targetNode() {
    return <HTMLSpanElement>this._targetEntity.section.targetNode;
  }

  public async dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._targetNode.setAttribute("contenteditable", "false");
    this._targetNode.removeEventListener("keydown", this._onKeyDown);

    // parse the innerHTML, set the source content, and prepare to diff
    this._targetEntity.source.removeAllChildNodes();
    (await parseHTML(this._targetNode.innerHTML)).children.forEach((child) => this._targetEntity.source.appendChild(child));

    // reset the html so that the entity is properly diffd
    (<Element>this._targetEntity.section.targetNode).innerHTML = " ";

    // save the workspae file -- diffing time
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
    return <EditorToolFactoryDependency>this._dependencies.query(editInnerHTMLDependency.ns);
  }

  createSource() {
    return parseHTML(`<span style="position:absolute;white-space: nowrap;font-family: Helvetica;">Type Something</span>`).children[0];
  }
}

export const textToolDependency = new EditorToolFactoryDependency("text", "text", "display", "t", InsertTextTool);
export const editInnerHTMLDependency = new EditorToolFactoryDependency("editInnerHTML", null, null, TEXT_TOOL_KEY_CODE, EditInnerHTMLTool);