// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import "./index.scss";

import cx =  require("classnames");
import React =  require("react");
import { inject } from "@tandem/common/decorators";
import { Workspace } from "@tandem/editor/browser/stores";
import { IInjectable } from "@tandem/common";
import { OpenFileRequest } from "@tandem/editor/common/messages";
import { AltInputComponent } from "@tandem/editor/browser/components";
import { fitBoundsInDocument } from "@tandem/editor/browser/utils";
import { intersection, flatten } from "lodash";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { MetadataKeys, ContextMenuTypes } from "@tandem/editor/browser/constants";
import { CallbackDispatcher, IDispatcher } from "@tandem/mesh";
import { BoundingRect, BaseApplicationComponent } from "@tandem/common";
import { SelectRequest, OpenContextMenuRequest } from "@tandem/editor/browser/messages";
import { SyntheticHTMLElement, SyntheticDOMElement, ChildElementQuerier } from "@tandem/synthetic-browser";

class SelectableComponent extends BaseApplicationComponent<{
  element: SyntheticHTMLElement,
  selection: any,
  zoom: number,
  absoluteBounds: BoundingRect,
  hovering: boolean,
  onSyntheticMouseDown: (element: SyntheticHTMLElement, event?: React.MouseEvent<any>) => void
}, any> {

  private _i: number = 0;
  private _mouseOver: boolean;
  private _elementObserver: IDispatcher<any, any>;

  onMouseDown = (event: React.MouseEvent<any>): any => {

    if (event.metaKey && this.props.element.source) {
      return OpenFileRequest.dispatch(this.props.element.source.uri, this.props.element.source, this.bus);
    }
    
    this.props.onSyntheticMouseDown(this.props.element, event);

    if (event.ctrlKey) {
      this.bus.dispatch(new OpenContextMenuRequest(ContextMenuTypes.SYNTHETIC_ELEMENT, event.clientX, event.clientY));
    }
    
    event.stopPropagation();
    this.onMouseOut(event);
  }

  hasSource() {
    return !!this.props.element.source;
  }

  shouldComponentUpdate({ absoluteBounds, hovering, zoom }) {
    return !this.props.absoluteBounds.equalTo(absoluteBounds) || this.props.hovering !== hovering || this.props.zoom !== zoom;
  }

  componentWillUnmount() {
    if (this._mouseOver) {
      this.props.element.metadata.set(MetadataKeys.HOVERING, false);
    }
  }

  onMouseOver = (event: React.MouseEvent<any>) => {
    this._mouseOver = true;
    this.props.element.metadata.set(MetadataKeys.HOVERING, true);
  }

  onMouseOut = (event: React.MouseEvent<any>) => {
    this._mouseOver = false;
    this.props.element.metadata.set(MetadataKeys.HOVERING, false);
  }

  render() {
    let { element, selection, absoluteBounds, hovering } = this.props;

    const borderWidth = 2 / this.props.zoom;



    absoluteBounds = fitBoundsInDocument(element);

    const classNames = cx({
      "m-selectable": true,
      "hover": hovering
    });

    const style = {
      background : "transparent",
      position   : "absolute",
      boxShadow  : `inset 0 0 0 ${borderWidth}px #00B5FF`,
      width      : absoluteBounds.width,
      height     : absoluteBounds.height,
      left       : absoluteBounds.left,
      top        : absoluteBounds.top
    };

    const getAltProps = () => {
      return {
        style: {
          cursor: this.hasSource() ? "pointer" : "not-allowed"
        }
      }
    }

    return (
      <AltInputComponent getAltProps={getAltProps}>
        <div
          style={style}
          className={classNames}
          onMouseLeave={this.onMouseOut}
          onMouseMove={this.onMouseOver}
          onMouseDown={this.onMouseDown}
        />
      </AltInputComponent>
    )
  }
}

export interface ISelectableComponentProps {
  zoom: number;
  show: boolean;
  workspace: Workspace;
  onSyntheticMouseDown: (element: SyntheticHTMLElement, event?: React.MouseEvent<any>) => void;
  canvasRootSelectable?: boolean;
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

  shouldComponentUpdate({ allElements, zoom, show }: ISelectableComponentProps) {
    return allElements !== this.props.allElements || this.props.zoom !== zoom || this.props.show !== show;
  }

  render() {

    if (!this.props.show) return null;

    const { workspace, zoom, allElements } = this.props;

    const isVisible = (element: SyntheticHTMLElement) => {
      const doc = element.ownerDocument.$ownerNode;
      if (!doc) return true;
      const elementBounds     = element.getAbsoluteBounds();
      const documentBounds    = (doc as SyntheticHTMLElement).getBoundingClientRect();
      return (elementBounds.left > documentBounds.left || elementBounds.right > documentBounds.left) &&
      elementBounds.left < documentBounds.right && 
      (elementBounds.top > documentBounds.top || elementBounds.bottom > documentBounds.top) && 
      elementBounds.top < documentBounds.bottom;
    }

    const visibleElements = allElements.filter(element => {
      return (element as SyntheticHTMLElement).getAbsoluteBounds && (element as SyntheticHTMLElement).getAbsoluteBounds().visible && element.getAttribute("data-td-selectable") !== "false" && isVisible(element as any)
    }) as SyntheticHTMLElement[];

    const selectables = visibleElements.map((element) => {
      return <SelectableComponent
        onSyntheticMouseDown={this.props.onSyntheticMouseDown}
        zoom={this.props.zoom}
        selection={[]}
        element={element}
        absoluteBounds={element.getAbsoluteBounds()}
        hovering={element.metadata.get(MetadataKeys.HOVERING)}
        key={element.browser.uid + "." + element.uid}
      />
    });

    return (<div className="m-selectables"> {selectables} </div>);
  }
}

