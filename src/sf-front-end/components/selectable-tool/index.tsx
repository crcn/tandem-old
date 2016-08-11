// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import "./index.scss";

import * as React from "react";
import { intersection } from "lodash";
import { SelectAction } from "sf-front-end/actions";
import { IVisibleEntity, IEntity } from "sf-core/entities";
import { inject } from "sf-core/decorators";
import { IInjectable, APPLICATION_SINGLETON_NS } from "sf-core/dependencies";
import { FrontEndApplication } from "sf-front-end/application";
import BoundingRect from "sf-core/geom/bounding-rect";

import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

class SelectableComponent extends React.Component<{ entity: IVisibleEntity, selection: any, app: FrontEndApplication, zoom: number }, any> {

  constructor() {
    super();
    this.state = {};
  }

  onMouseDown(event: any): void {
    this.props.app.bus.execute(new SelectAction(this.props.entity, event.shiftKey));
    event.stopPropagation();
  }

  render() {
    const { entity, selection, app } = this.props;

    if (!entity.display) return null;
    const entities = entity.flatten();

    if (intersection(entities, selection || []).length) return null;

    const bounds = entity.display.bounds;

    const borderWidth = 2 / this.props.zoom;

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
        className="m-selectable"
        onMouseDown={this.onMouseDown.bind(this)}
      />
    );
  }
}

// @injectable
export default class SelectablesComponent extends React.Component<{selection: any, allEntities: Array<IEntity>, bus: any, app: any, zoom: number }, {}>  {

  render() {

    const selection = this.props.selection || [];
    const allEntities = this.props.allEntities;

    // TODO - probably better to check if mouse is down on stage instead of checking whether the selected items are being moved.
    if (selection.display && selection.display.moving) return null;

    // if (selection.preview.currentTool.type !== "pointer") return null;

    const selectables = allEntities.filter((entity) => (
      !!entity["display"]
    )).map((entity, i) => (
      <SelectableComponent
        {...this.props}
        zoom={this.props.zoom}
        selection={selection}
        entity={entity as IVisibleEntity}
        key={i}
      />
    ));

    return (<div className="m-selectables"> {selectables} </div>);
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/pointer/selectable", SelectablesComponent);
