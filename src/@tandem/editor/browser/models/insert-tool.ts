import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { BaseEditorTool, IWorkspaceTool, IWorkspace } from "@tandem/editor/browser/models";
import { MouseAction, SetToolAction, SelectAction } from "@tandem/editor/browser/actions";
import {
  Action,
  IActor,
  inject,
  Service,
  startDrag,
  PrivateBusDependency,
  BoundingRect,
} from "@tandem/common";


export abstract class InsertTool extends BaseEditorTool {

  readonly cursor: string = "crosshair";
  readonly name: string =  "insert";
  public entityIsRoot: boolean = false;

  @inject(PrivateBusDependency.ID)
  readonly bus: IActor;

  readonly resizable: boolean = true;

  $didInject() {

    // deselect all
    this.bus.execute(new SelectAction());
  }

  abstract createSyntheticDOMElement(): SyntheticDOMElement;
  abstract get displayEntityToolFactory(): { create(editor: IWorkspace): IWorkspaceTool }
}