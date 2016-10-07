import "./index.scss";

import * as React from "react";
import { startDrag } from "@tandem/common/utils/component";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectablesComponent } from "@tandem/editor/components/selectables";
import { SyntheticMarkupElement } from "@tandem/synthetic-browser";
import { SelectionSizeComponent } from "@tandem/editor/components/selection-size";
import { VisibleEntityCollection } from "@tandem/editor/collections";
import { SetToolAction, SelectAction } from "@tandem/editor/actions";
import { Workspace, Editor, InsertTool } from "@tandem/editor/models";
import { ReactComponentFactoryDependency } from "@tandem/editor/dependencies";
import { IActor, Action, BaseEntity, BoundingRect, appendSourceChildren, IEntity, IVisibleEntity } from "@tandem/common";

class InsertToolComponent extends React.Component<{ editor: Editor, bus: IActor, workspace: Workspace, app: FrontEndApplication, tool: InsertTool }, any> {

  private _targetElement: SyntheticMarkupElement;


  private onRootMouseDown = (event) => {
    this._targetElement = this.props.editor.browser.window.document.body;
    this._insertNewItem(event);
  }

  private _insertNewItem = async (syntheticEvent) => {

    const event = syntheticEvent.nativeEvent as MouseEvent;

    const { editor, bus, workspace, tool } = this.props;

    const activeEntity =  this._targetElement;
    const childExpression = tool.createSource();
    // const child = await activeEntity.loadExpressionAndAppendChild(childExpression) as IVisibleEntity;
    // await bus.execute(new SelectAction(child));

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

  onSyntheticMouseDown = (element: SyntheticMarkupElement, event: MouseEvent) => {
    this._targetElement = element;
    this._insertNewItem(event);
  }

  render() {
    const { editor, tool } = this.props;

    if (!(tool instanceof InsertTool)) return null;

    const selection = new VisibleEntityCollection(...this.props.editor.selection);
    const zoom = this.props.editor.transform.scale;
    const display = selection.display;
    const bounds = selection.length ? display.bounds : undefined;
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
      { selection.length && display.capabilities.resizable && tool.resizable ? <SelectionSizeComponent left={bounds.left + bounds.width} top={bounds.top + bounds.height} bounds={bounds} zoom={zoom} /> : undefined }
    </div>;
  }
}

export const insertToolComponentDependency = new ReactComponentFactoryDependency("components/tools/insert/size", InsertToolComponent);
