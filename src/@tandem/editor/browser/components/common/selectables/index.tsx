// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import "./index.scss";

import cx =  require("classnames");
import React =  require("React");
import { inject } from "@tandem/common/decorators";
import { CallbackDispatcher, IDispatcher } from "@tandem/mesh";
import { Workspace } from "@tandem/editor/browser/stores";
import { SelectRequest } from "@tandem/editor/browser/messages";
import { AltInputComponent } from "@tandem/editor/browser/components";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { OpenFileRequest } from "@tandem/editor/common/messages";
import { intersection, flatten } from "lodash";
import { IInjectable } from "@tandem/common";
import { BoundingRect, BaseApplicationComponent } from "@tandem/common";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";
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
      return OpenFileRequest.dispatch(this.props.element.source.filePath, this.props.element.source, this.bus);
    }
    this.props.onSyntheticMouseDown(this.props.element, event);
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
    const { element, selection, absoluteBounds, hovering } = this.props;

    const borderWidth = 2 / this.props.zoom;

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

    const visibleElements = allElements.filter(element => {
      return (element as SyntheticHTMLElement).getAbsoluteBounds && (element as SyntheticHTMLElement).getAbsoluteBounds().visible && element.getAttribute("data-td-selectable") !== "false"
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

