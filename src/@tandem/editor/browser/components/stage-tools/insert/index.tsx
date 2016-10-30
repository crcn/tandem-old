import "./index.scss";

import * as React from "react";
import { startDrag } from "@tandem/common/utils/component";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { Workspace, InsertTool } from "@tandem/editor/browser/models";
import { SetToolAction, SelectAction } from "@tandem/editor/browser/actions";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { SyntheticDOMElement, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { SelectionSizeComponent, SelectablesComponent } from "@tandem/editor/browser/components/common";
import {
  IActor,
  Action,
  BoundingRect,
  BaseApplicationComponent,
} from "@tandem/common";

export class InsertStageToolComponent extends BaseApplicationComponent<{ workspace: Workspace, allElements: SyntheticDOMElement[], zoom: number, tool: InsertTool }, any> {

  private _targetElement: any;


  private onRootMouseDown = (event) => {
    this._targetElement = this.props.workspace.document.body as any;
    this._insertNewItem(event);
  }

  private _insertNewItem = async (syntheticEvent) => {

    const event = syntheticEvent.nativeEvent as MouseEvent;

    const { workspace, tool } = this.props;

    const childElement = tool.createSyntheticDOMElement();
    // const elementEditor = this._targetEntity.editor;
    this._targetElement.appendChild(childElement);
    // await elementEditor.execute()
    // const child = await activeEntity.loadExpressionAndAppendChild(childExpression) as IVisibleEntity;
    await this.bus.execute(new SelectAction(childElement));

    // const capabilities = child.display.capabilities;

    // let left = 0;
    // let top  = 0;

    // if (capabilities.movable) {
    //   left = (event.pageX - editor.transform.left) / editor.transform.scale;
    //   top  = (event.pageY - editor.transform.top) / editor.transform.scale;
    // }

    // child.display.position = { left, top };


    // const complete = async () => {
    //   child.parent.source.appendChild(childExpression);
    //   bus.execute(new SetToolAction(tool.displayEntityToolFactory));
    // };

    // if (capabilities.resizable && tool.resizable) {

    //   startDrag(event, (event, { delta }) => {

    //     const width  = delta.x / editor.transform.scale;
    //     const height = delta.y / editor.transform.scale;

    //     child.display.bounds = new BoundingRect(left, top, left + width, top + height);

    //   }, complete);
    // } else {
    //   complete();
    // }
  }

  onSyntheticMouseDown = (element: SyntheticHTMLElement, event: React.MouseEvent<any>) => {
    this._targetElement = element;
    this._insertNewItem(event);
  }

  render() {
    const { workspace, tool } = this.props;

    if (!(tool instanceof InsertTool)) return null;

    const selection = []; //new VisibleDOMEntityCollection(...this.props.workspace.selection);
    const zoom = this.props.workspace.transform.scale;
    const scale = 1 / workspace.transform.scale;

    const bgstyle = {
      position: "fixed",
      background: "transparent",
      top: 0,
      left: 0,
      transform: `translate(${-workspace.transform.left * scale}px, ${-workspace.transform.top * scale}px) scale(${scale})`,
      transformOrigin: "top left",
      width: "100%",
      height: "100%"
    };

    return <div className="m-insert-tool">
      <div onMouseDown={this.onRootMouseDown} style={bgstyle} />
      { !tool.entityIsRoot ? <SelectablesComponent {...this.props} zooming={false} canvasRootSelectable={true} onSyntheticMouseDown={this.onSyntheticMouseDown} zoom={this.props.zoom} /> : null }
    </div>;
  }
}

