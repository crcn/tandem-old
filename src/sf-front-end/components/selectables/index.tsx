// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { inject } from "sf-core/decorators";
import { Workspace } from "sf-front-end/models";
import { BoundingRect } from "sf-core/geom";
import { SelectAction } from "sf-front-end/actions";
import { MetadataKeys } from "sf-front-end/constants";
import { FrontEndApplication } from "sf-front-end/application";
import { intersection, flatten } from "lodash";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";
import { IInjectable, APPLICATION_SINGLETON_NS } from "sf-core/dependencies";
import { IVisibleEntity, IEntity, IContainerEntity } from "sf-core/entities";

class SelectableComponent extends React.Component<{
  entity: IVisibleEntity,
  selection: any,
  app: FrontEndApplication,
  zoom: number,
  onEntityMouseDown: (entity: IVisibleEntity, event?: MouseEvent) => void
}, any> {

  constructor() {
    super();
    this.state = {};
  }

  onMouseDown = (event: MouseEvent): void => {
    this.props.onEntityMouseDown(this.props.entity, event);
    event.stopPropagation();
    this.onMouseOut(event);
 }

  onMouseOver = (event: MouseEvent) => {
    this.props.app.metadata.set(MetadataKeys.HOVER_ITEM, this.props.entity);
  }

  onMouseOut = (event: MouseEvent) => {
    this.props.app.metadata.set(MetadataKeys.HOVER_ITEM, undefined);
  }


  render() {
    const { entity, selection, app } = this.props;

    if (!entity.display) return null;
    const entities = entity.flatten();

    if (intersection(entities, selection || []).length) return null;

    const bounds = entity.display.bounds;

    const borderWidth = 2 / this.props.zoom;

    const classNames = cx({
      "m-selectable": true,
      "hover": this.props.app.metadata.get(MetadataKeys.HOVER_ITEM) === this.props.entity
    });

    const style = {
      background : "transparent",
      position   : "absolute",
      boxShadow  : `0 0 0 ${borderWidth}px #6f98e0`,
      width      : bounds.width,
      height     : bounds.height,
      left       : bounds.left,
      top        : bounds.top
    };

    return (
      <div
        style={style}
        className={classNames}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
        onMouseDown={this.onMouseDown}
      />
    );
  }
}

// @injectable
export class SelectablesComponent extends React.Component<{
  app: any,
  workspace: Workspace,
  onEntityMouseDown: (entity: IVisibleEntity, event?: MouseEvent) => void,
  canvasRootSelectable?: boolean
}, {}>  {

  render() {

    const selection = this.props.workspace.selection;
    const allEntities = this.props.workspace.file.document.flatten() as Array<IEntity>;
    const activeEntity = this.props.workspace.editor.activeEntity as IContainerEntity;
    if (!activeEntity.childNodes) return null;

    // TODO - probably better to check if mouse is down on stage instead of checking whether the selected items are being moved.
    if (selection && selection.metadata.get(MetadataKeys.MOVING)) return null;

    // if (selection.preview.currentTool.type !== "pointer") return null;

    const selectables = allEntities.filter((entity) => (
      entity.hasOwnProperty("display") && (this.props.canvasRootSelectable || entity.metadata.get(MetadataKeys.CANVAS_ROOT) !== true || (entity as IContainerEntity).childNodes.length === 0)
    )).map((entity, i) => (
      <SelectableComponent
        {...this.props}
        zoom={this.props.workspace.editor.zoom}
        selection={selection}
        entity={entity as IVisibleEntity}
        key={i}
      />
    ));

    return (<div className="m-selectables"> {selectables} </div>);
  }
}

