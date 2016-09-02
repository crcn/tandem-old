import "./index.scss";

import * as React from "react";
import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";
import { startDrag } from "sf-front-end/utils/component";
import { BoundingRect } from "sf-core/geom";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectablesComponent } from "sf-front-end/components/selectables";
import { SelectionSizeComponent } from "sf-front-end/components/selection-size";
import { VisibleEntityCollection } from "sf-front-end/collections";
import { SetToolAction, SelectAction } from "sf-front-end/actions";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";
import { Workspace, Editor, InsertTool } from "sf-front-end/models";
import { IEntity, IVisibleEntity, appendSourceChildren } from "sf-core/ast/entities";

class InsertToolComponent extends React.Component<{ editor: Editor, bus: IActor, workspace: Workspace, app: FrontEndApplication, tool: InsertTool }, any> {

  private _targetEntity: IEntity;


  private onRootMouseDown = (event) => {
    this._targetEntity = this.props.workspace.file.entity;
    this._insertNewItem(event);
  }

  private _insertNewItem = async (syntheticEvent) => {

    const event = syntheticEvent.nativeEvent as MouseEvent;

    const { editor, bus, workspace, tool } = this.props;

    const activeEntity =  this._targetEntity as IEntity;
    const child = (await appendSourceChildren(activeEntity, tool.createSource()))[0] as IVisibleEntity;
    console.log(child);
    await bus.execute(new SelectAction(child));

    const capabilities = child.display.capabilities;

    let left = 0;
    let top  = 0;

    if (capabilities.movable) {
      left = (event.pageX - editor.transform.left) / editor.transform.scale;
      top  = (event.pageY - editor.transform.top) / editor.transform.scale;
    }

    child.display.position = { left, top };

    const complete = async () => {
      bus.execute(new SetToolAction(tool.displayEntityToolFactory));
    };

    if (capabilities.resizable && tool.resizable) {

      startDrag(event, (event, { delta }) => {

        const width  = (delta.x) / editor.transform.scale;
        const height = (delta.y) / editor.transform.scale;

        child.display.bounds = new BoundingRect(left, top, left + width, top + height);

      }, complete);
    } else {
      complete();
    }
  }

  onEntityMouseDown = (entity: IEntity, event: MouseEvent) => {
    this._targetEntity = entity;
    this._insertNewItem(event);
  }

  render() {
    const { editor, tool } = this.props;

    if (!(tool instanceof InsertTool)) return null;

    const selection = new VisibleEntityCollection(...this.props.editor.workspace.selection);
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
      { !tool.entityIsRoot ? <SelectablesComponent {...this.props} canvasRootSelectable={true} onEntityMouseDown={this.onEntityMouseDown} /> : null }
      { selection.length && display.capabilities.resizable && tool.resizable ? <SelectionSizeComponent left={bounds.left + bounds.width} top={bounds.top + bounds.height} bounds={bounds} zoom={zoom} /> : undefined }
    </div>;
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/insert/size", InsertToolComponent);
