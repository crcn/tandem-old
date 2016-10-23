import "./index.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/models";
import { flatten } from "lodash";
import RulerComponent from "./ruler";
import { PointerTool } from "@tandem/editor/models/pointer-tool";
import ResizerComponent from "./resizer";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectionSizeComponent } from "@tandem/editor/components/common";
import { BoundingRect, flattenTree } from "@tandem/common";
import { ReactComponentFactoryDependency } from "@tandem/editor/dependencies";
import { VisibleSyntheticElementCollection } from "@tandem/editor/collections";

export default class SelectorComponent extends React.Component<{ workspace: Workspace, tool: PointerTool, app: FrontEndApplication, zoom: number  }, any> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onResizing = (event) => {
    this.setState({ resizing: true, mouseLeft: (event.pageX - this.props.workspace.transform.left) / this.props.zoom, mouseTop: (event.pageY - this.props.workspace.transform.top) / this.props.zoom });
  }

  onStopResizing = () => {
    this.setState({ resizing: false });
  }

  onMoving = () => {
    this.setState({ moving: true });
  }

  onStopMoving = () => {
    this.setState({ moving: false });
  }

  render() {

    const { workspace, tool } = this.props;

    if (!(tool instanceof PointerTool)) return null;

    const selection = new VisibleSyntheticElementCollection(...(workspace.selection as any));

    // simple check to see if the selection array
    // is an IEntityDisplay
    if (!selection.length) return null;

    const entireBounds = selection.absoluteBounds;

    const borderWidth = 1 / this.props.zoom;

    const boundsStyle = {
      position: "absolute",
      top: entireBounds.top,
      left: entireBounds.left,
      width: entireBounds.width,
      height: entireBounds.height,
      boxShadow: `inset 0 0 0 ${borderWidth}px #a4b7d7`
    };

    const sections: any = {
      bounds: <div className="m-selector-component--bounds" style={boundsStyle} />,
      resizer: <ResizerComponent {...this.props} strokeWidth={2} selection={selection} onResizing={this.onResizing} onStopResizing={this.onStopResizing} onMoving={this.onMoving} onStopMoving={this.onStopMoving} />
    };

    if (this.state.resizing) {
      sections.size = <SelectionSizeComponent left={this.state.mouseLeft} top={this.state.mouseTop} zoom={this.props.zoom} bounds={entireBounds} />;
    }

    return (<div className="m-selector-component">
      { sections.bounds }
      { sections.resizer }
      { sections.size }
    </div>);
  }
}

export const selectorToolComponentDependency = new ReactComponentFactoryDependency("components/tools/pointer/selector", SelectorComponent);
