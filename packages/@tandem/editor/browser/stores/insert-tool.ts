import { IDispatcher } from "@tandem/mesh";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { BaseEditorTool, IWorkspaceTool } from "@tandem/editor/browser/stores";
import { MouseAction, SetToolRequest, SelectRequest } from "@tandem/editor/browser/messages";
import {
  CoreEvent,
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
  readonly bus:  IDispatcher<any, any>;

  readonly resizable: boolean = true;

  $didInject() {

    // deselect all
    this.bus.dispatch(new SelectRequest());
  }

  abstract createSyntheticDOMElement(): SyntheticDOMElement;
  abstract get displayEntityToolFactory(): { create(editor: any): IWorkspaceTool }
}