// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { inject } from "@tandem/common/decorators";
import { Workspace } from "@tandem/editor/models";
import { BoundingRect } from "@tandem/common/geom";
import { SelectAction } from "@tandem/editor/actions";
import { MetadataKeys } from "@tandem/editor/constants";
import { FrontEndApplication } from "@tandem/editor/application";
import { intersection, flatten } from "lodash";
import { ReactComponentFactoryDependency } from "@tandem/editor/dependencies";
import { SyntheticHTMLElement, SyntheticDOMElement } from "@tandem/synthetic-browser";
import { IInjectable, APPLICATION_SINGLETON_NS, IActor, Action } from "@tandem/common";

class SelectableComponent extends React.Component<{
  element: SyntheticHTMLElement,
  selection: any,
  app: FrontEndApplication,
  zoom: number,
  absoluteBounds: BoundingRect,
  hovering: boolean,
  onSyntheticMouseDown: (element: SyntheticHTMLElement, event?: React.MouseEvent) => void
}, any> {

  private _i: number = 0;

  constructor() {
    super();
    this.state = {};
  }

  onMouseDown = (event: React.MouseEvent): void => {
    this.props.onSyntheticMouseDown(this.props.element, event);
    event.stopPropagation();
    this.onMouseOut(event);
  }

  shouldComponentUpdate({ absoluteBounds, hovering }) {
    return !this.props.absoluteBounds.equalTo(absoluteBounds) || this.props.hovering !== hovering;
  }

  onMouseOver = (event: React.MouseEvent) => {

    // TODO - add hovering prop
    this.props.element.metadata.set(MetadataKeys.HOVERING, true);
  }

  onMouseOut = (event: React.MouseEvent) => {
    this.props.element.metadata.set(MetadataKeys.HOVERING, false);
  }

  render() {
    const { element, selection, app, absoluteBounds, hovering } = this.props;

    const borderWidth = 2 / this.props.zoom;

    const classNames = cx({
      "m-selectable": true,
      "hover": hovering
    });

    const style = {
      background : "transparent",
      position   : "absolute",
      boxShadow  : `inset 0 0 0 ${borderWidth}px #6f98e0`,
      width      : absoluteBounds.width,
      height     : absoluteBounds.height,
      left       : absoluteBounds.left,
      top        : absoluteBounds.top
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
  onSyntheticMouseDown: (element: SyntheticHTMLElement, event?: React.MouseEvent) => void,
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
      // for (const entity of this.props.workspace.file.entity.flatten()) {
      //   entity.metadata.set(MetadataKeys.HOVERING, false);
      // }
    }
  }

  onDocumentKeyUp = (event: KeyboardEvent) => {
    if (/Meta|Alt/.test(event.key)) {
      this.setState({ showSelectables: true });
    }
  }
  render() {

    if (!this.state.showSelectables) return null;
    const { document } = this.props.app.workspace;

    if (!document) return null;

    const { workspace, app } = this.props;
    const { selection } = workspace;
    // do not render selectables that are off screen
    //
    // TODO - probably better to check if mouse is down on stage instead of checking whether the selected items are being moved.

    // TODO - check if user is scrolling
    if (selection && workspace.metadata.get(MetadataKeys.MOVING) || app.metadata.get(MetadataKeys.ZOOMING)) return null;

    const allElements = document.querySelectorAll("*", true).filter((node: SyntheticDOMElement) => node["getAbsoluteBounds"]/* && entity.metadata.get(MetadataKeys.ENTITY_VISIBLE)*/) as any as SyntheticHTMLElement[];

    const selectables = allElements.map((element) => {
      const bounds = element.getAbsoluteBounds();
      if (!bounds.visible) return null;
      return <SelectableComponent
        {...this.props}
        zoom={workspace.zoom}
        selection={selection}
        element={element}
        absoluteBounds={element.getAbsoluteBounds()}
        hovering={element.metadata.get(MetadataKeys.HOVERING)}
        key={element.uid}
      />
    });

    return (<div className="m-selectables"> {selectables} </div>);
  }
}

