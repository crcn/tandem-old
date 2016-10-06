// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { inject } from "@tandem/common/decorators";
import { Editor } from "@tandem/editor/models";
import { BoundingRect } from "@tandem/common/geom";
import { SelectAction } from "@tandem/editor/actions";
import { MetadataKeys } from "@tandem/editor/constants";
import { FrontEndApplication } from "@tandem/editor/application";
import { intersection, flatten } from "lodash";
import { IVisibleEntity, IEntity } from "@tandem/common/lang/entities";
import { ReactComponentFactoryDependency } from "@tandem/editor/dependencies";
import { IInjectable, APPLICATION_SINGLETON_NS, IActor, Action } from "@tandem/common";
import { SyntheticMarkupElement } from "@tandem/synthetic-browser";

class SelectableComponent extends React.Component<{
  element: SyntheticMarkupElement,
  selection: any,
  app: FrontEndApplication,
  zoom: number,
  onEntityMouseDown: (element: SyntheticMarkupElement, event?: MouseEvent) => void
}, any> {

  private _i: number = 0;

  constructor() {
    super();
    this.state = {};
  }

  onMouseDown = (event: MouseEvent): void => {
    this.props.onEntityMouseDown(this.props.element, event);
    event.stopPropagation();
    this.onMouseOut(event);
 }

  onMouseOver = (event: MouseEvent) => {
    this.props.element.setAttribute(`data-${MetadataKeys.HOVERING}`, true);
  }

  onMouseOut = (event: MouseEvent) => {
    this.props.element.setAttribute(`data-${MetadataKeys.HOVERING}`, false);
  }

  shouldComponentUpdate(props) {
    // return props.hovering;
    return true;
  }

  render() {
    const { element, selection, app } = this.props;

    // const entities = element.querySelectorAll("*");

    // if (intersection(entities, selection || []).length) return null;

    const bounds = element.getBoundingClientRect();
    if (!bounds) return null;

    const borderWidth = 2 / this.props.zoom;

    const classNames = cx({
      "m-selectable": true,
      "hover": this.props.element.getAttribute(`data-${MetadataKeys.HOVERING}`)
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
  editor: Editor,
  onEntityMouseDown: (element: SyntheticMarkupElement, event?: MouseEvent) => void,
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
    const { document } = this.props.app.editor.browser.window;

    const { editor, app } = this.props;
    const { selection } = editor;
    // do not render selectables that are off screen
    //
    // TODO - probably better to check if mouse is down on stage instead of checking whether the selected items are being moved.

    // TODO - check if user is scrolling
    if (selection && editor.metadata.get(MetadataKeys.MOVING) || app.metadata.get(MetadataKeys.ZOOMING)) return null;

    const allEntities = document.querySelectorAll("*"); // this.props.workspace.file.entity.flatten() as Array<IEntity>;

    // if (selection.preview.currentTool.type !== "pointer") return null;

    const selectables = allEntities.map((element, i) => (
      <SelectableComponent
        {...this.props}
        zoom={editor.zoom}
        selection={selection}
        element={element}
        key={i}
      />
    ));

    return (<div className="m-selectables"> {selectables} </div>);
  }
}

