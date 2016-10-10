import "./index.scss";

import * as React from "react";
import { startDrag } from "@tandem/common/utils/component";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectablesComponent } from "@tandem/editor/components/selectables";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { SelectionSizeComponent } from "@tandem/editor/components/selection-size";
import { VisibleDOMEntityCollection } from "@tandem/editor/collections";
import { SetToolAction, SelectAction } from "@tandem/editor/actions";
import { Workspace, Editor, InsertTool } from "@tandem/editor/models";
import { ReactComponentFactoryDependency } from "@tandem/editor/dependencies";
import { BaseVisibleSyntheticDOMNodeEntity } from "@tandem/synthetic-browser";
import {
  IActor,
  Action,
  IEntity,
  BaseEntity,
  BoundingRect,
  appendSourceChildren,
} from "@tandem/common";

class InsertToolComponent extends React.Component<{ editor: Editor, bus: IActor, workspace: Workspace, app: FrontEndApplication, tool: InsertTool }, any> {

  private _targetEntity: any;


  private onRootMouseDown = (event) => {
    this._targetEntity = this.props.editor.document.body as any;
    this._insertNewItem(event);
  }

  private _insertNewItem = async (syntheticEvent) => {

    const event = syntheticEvent.nativeEvent as MouseEvent;

    const { editor, bus, workspace, tool } = this.props;

    const childElement = tool.createSyntheticDOMElement();
    // const elementEditor = this._targetEntity.editor;
    this._targetEntity.appendChild(childElement);
    // await elementEditor.execute()
    // const child = await activeEntity.loadExpressionAndAppendChild(childExpression) as IVisibleEntity;
    await bus.execute(new SelectAction(childElement));

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

  onSyntheticMouseDown = (entity: BaseVisibleSyntheticDOMNodeEntity<any, any>, event: MouseEvent) => {
    this._targetEntity = entity;
    this._insertNewItem(event);
  }

  render() {
    const { editor, tool } = this.props;

    if (!(tool instanceof InsertTool)) return null;

    const selection = new VisibleDOMEntityCollection(...this.props.editor.selection);
    const zoom = this.props.editor.transform.scale;
    const scale = 1 / editor.transform.scale;

    const bgstyle = {
      position: "fixed",
      background: "transparent",
      top: 0,
      left: 0,
      transform: `translate(${-editor.transform.left * scale}px, ${-editor.transform.top * scale}px) scale(${scale})`,
      transformOrigin: "top left",
      width: "100%",
      height: "100%"
    };

    return <div className="m-insert-tool">
      <div onMouseDown={this.onRootMouseDown} style={bgstyle} />
      { !tool.entityIsRoot ? <SelectablesComponent {...this.props} canvasRootSelectable={true} onSyntheticMouseDown={this.onSyntheticMouseDown} /> : null }
    </div>;
  }
}

export const insertToolComponentDependency = new ReactComponentFactoryDependency("components/tools/insert/size", InsertToolComponent);
