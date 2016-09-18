// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { inject } from "tandem-common/decorators";
import { Workspace } from "tandem-front-end/models";
import { BoundingRect } from "tandem-common/geom";
import { SelectAction } from "tandem-front-end/actions";
import { MetadataKeys } from "tandem-front-end/constants";
import { FrontEndApplication } from "tandem-front-end/application";
import { intersection, flatten } from "lodash";
import { IVisibleEntity, IEntity } from "tandem-common/ast/entities";
import { ReactComponentFactoryDependency } from "tandem-front-end/dependencies";
import { IInjectable, APPLICATION_SINGLETON_NS, IActor, Action } from "tandem-common";

class SelectableComponent extends React.Component<{
  entity: IVisibleEntity,
  selection: any,
  app: FrontEndApplication,
  documentContent: string,
  zoom: number,
  onEntityMouseDown: (entity: IVisibleEntity, event?: MouseEvent) => void
}, any> {

  private _i: number = 0;

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
    this.props.entity.metadata.set(MetadataKeys.HOVERING, true);
  }

  onMouseOut = (event: MouseEvent) => {
    this.props.entity.metadata.set(MetadataKeys.HOVERING, false);
  }

  shouldComponentUpdate(props) {
    // return props.hovering;
    return true;
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
      "hover": this.props.entity.metadata.get(MetadataKeys.HOVERING)
    });

    const style = {
      background : "transparent",
      position   : "absolute",
      boxShadow  : `inset 0 0 0 ${borderWidth}px #6f98e0`,
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
  app: FrontEndApplication,
  workspace: Workspace,
  onEntityMouseDown: (entity: IVisibleEntity, event?: MouseEvent) => void,
  canvasRootSelectable?: boolean
}, { showSelectables: boolean }> {

  constructor(props: any) {
    super(props);
    this.state = { showSelectables: true };
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this.onDocumentKeyDown);
    document.body.addEventListener("keyup", this.onDocumentKeyUp);
  }

  onDocumentKeyDown = (event: KeyboardEvent) => {
    if (/Meta|Alt/.test(event.key)) {
      this.setState({ showSelectables: false });

      // hack to fix issue where selectables are highlighted after showSelectables becomes true
      for (const entity of this.props.workspace.file.entity.flatten()) {
        entity.metadata.set(MetadataKeys.HOVERING, false);
      }
    }
  }

  onDocumentKeyUp = (event: KeyboardEvent) => {
    if (/Meta|Alt/.test(event.key)) {
      this.setState({ showSelectables: true });
    }
  }
  render() {

    if (!this.state.showSelectables) return null;

    const { workspace, app } = this.props;
    const { selection } = workspace;
    const activeEntity = this.props.workspace.editor.activeEntity;
    if (!activeEntity.children) return null;
    // do not render selectables that are off screen
    //
    // TODO - probably better to check if mouse is down on stage instead of checking whether the selected items are being moved.

    // TODO - check if user is scrolling
    if (selection && workspace.editor.metadata.get(MetadataKeys.MOVING) || app.metadata.get(MetadataKeys.ZOOMING)) return null;

    const allEntities = this.props.workspace.file.entity.flatten() as Array<IEntity>;

    // if (selection.preview.currentTool.type !== "pointer") return null;

    const selectables = allEntities.filter((entity: IVisibleEntity) => (
      entity.display && (this.props.canvasRootSelectable || entity.metadata.get(MetadataKeys.CANVAS_ROOT) !== true || entity.children.find((child) => child["display"]) == null) && entity.display.visible
    )).map((entity, i) => (
      <SelectableComponent
        {...this.props}
        documentContent={this.props.workspace.file.content}
        zoom={this.props.workspace.editor.zoom}
        selection={selection}
        entity={entity as IVisibleEntity}
        key={i}
      />
    ));

    return (<div className="m-selectables"> {selectables} </div>);
  }
}

