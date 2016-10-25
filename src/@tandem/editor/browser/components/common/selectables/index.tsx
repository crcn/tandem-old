// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { inject } from "@tandem/common/decorators";
import { WrapBus } from "mesh";
import { Workspace } from "@tandem/editor/browser/models";
import { BoundingRect } from "@tandem/common/geom";
import { SelectAction } from "@tandem/editor/browser/actions";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { intersection, flatten } from "lodash";
import { ReactComponentFactoryDependency } from "@tandem/editor/browser/dependencies";
import { IInjectable, APPLICATION_SINGLETON_NS, IActor, Action } from "@tandem/common";
import { SyntheticHTMLElement, SyntheticDOMElement, ChildElementQuerier } from "@tandem/synthetic-browser";

class SelectableComponent extends React.Component<{
  element: SyntheticHTMLElement,
  selection: any,
  app: FrontEndApplication,
  zoom: number,
  absoluteBounds: BoundingRect,
  hovering: boolean,
  onSyntheticMouseDown: (element: SyntheticHTMLElement, event?: React.MouseEvent<any>) => void
}, any> {

  private _i: number = 0;
  private _mouseOver: boolean;
  private _elementObserver: IActor;

  constructor() {
    super();
    this.state = {};
  }

  onMouseDown = (event: React.MouseEvent<any>): void => {
    this.props.onSyntheticMouseDown(this.props.element, event);
    event.stopPropagation();
    this.onMouseOut(event);
  }

  shouldComponentUpdate({ absoluteBounds, hovering }) {
    return !this.props.absoluteBounds.equalTo(absoluteBounds) || this.props.hovering !== hovering;
  }

  componentWillUnmount() {
    if (this._mouseOver) {
      this.props.element.metadata.set(MetadataKeys.HOVERING, false);
    }
    // this.props.element.unobserve(this._elementObserver);
  }

  componentDidMount() {
    // this._elementObserver = new WrapBus(this.forceUpdate.bind(this));
    // this.props.element.observe(this._elementObserver);
  }

  onMouseOver = (event: React.MouseEvent<any>) => {
    this._mouseOver = true;

    // TODO - add hovering prop
    this.props.element.metadata.set(MetadataKeys.HOVERING, true);
  }

  onMouseOut = (event: React.MouseEvent<any>) => {
    this._mouseOver = false;
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
        onMouseLeave={this.onMouseOut}
        onMouseEnter={this.onMouseOver}
        onMouseDown={this.onMouseDown}
      />
    );
  }
}

interface ISelectableComponentProps {
  app: FrontEndApplication,
  workspace: Workspace,
  onSyntheticMouseDown: (element: SyntheticHTMLElement, event?: React.MouseEvent<any>) => void,
  canvasRootSelectable?: boolean,
  allElements: SyntheticDOMElement[]
}

// @injectable
export class SelectablesComponent extends React.Component<ISelectableComponentProps, {}> {

  /**
   * This component is too expensive to update each time something changes in the app.
   * Need to use observables for this one.
   *
   * @returns
   */

  shouldComponentUpdate({ allElements }: ISelectableComponentProps) {
    return allElements !== this.props.allElements;
  }

  render() {

    const { workspace, app, allElements } = this.props;

    const visibleElements = allElements.filter(element => {
      return (element as SyntheticHTMLElement).getAbsoluteBounds && (element as SyntheticHTMLElement).getAbsoluteBounds().visible
    }) as SyntheticHTMLElement[];

    const selectables = visibleElements.map((element) => {
      return <SelectableComponent
        {...this.props}
        zoom={workspace.zoom}
        selection={[]}
        element={element}
        absoluteBounds={element.getAbsoluteBounds()}
        hovering={element.metadata.get(MetadataKeys.HOVERING)}
        key={element.uid}
      />
    });

    return (<div className="m-selectables"> {selectables} </div>);
  }
}

