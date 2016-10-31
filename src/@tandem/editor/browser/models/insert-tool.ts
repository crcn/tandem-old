import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { BaseEditorTool, IWorkspaceTool } from "@tandem/editor/browser/models";
import { MouseAction, SetToolAction, SelectAction } from "@tandem/editor/browser/actions";
import {
  Action,
  IActor,
  inject,
  startDrag,
  PrivateBusProvider,
  BoundingRect,
} from "@tandem/common";


export abstract class InsertTool extends BaseEditorTool {

  readonly cursor: string = "crosshair";
  readonly name: string =  "insert";
  public entityIsRoot: boolean = false;

  @inject(PrivateBusProvider.ID)
  readonly bus: IActor;

  readonly resizable: boolean = true;

  $didInject() {

    // deselect all
    this.bus.execute(new SelectAction());
  }

  abstract createSyntheticDOMElement(): SyntheticDOMElement;
  abstract get displayEntityToolFactory(): { create(editor: any): IWorkspaceTool }
}