import "./index.scss";
import * as React from "react";
import RulerComponent from "./ruler";
import ResizerComponent from "./resizer";
import { Editor, Workspace } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectionSizeComponent } from "sf-front-end/components/selection-size";
import { DisplayEntitySelection } from "sf-front-end/models";
import { IEntityDisplay, IEntity } from "sf-core/entities";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

export default class SelectorComponent extends React.Component<{ editor: Editor, workspace: Workspace, app: FrontEndApplication, zoom: number, allEntities: Array<IEntity> }, any> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onResizing = (event) => {
    this.setState({ resizing: true, mouseLeft: (event.pageX - this.props.editor.transform.left) / this.props.zoom, mouseTop: (event.pageY - this.props.editor.transform.top) / this.props.zoom });
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

    const workspace = this.props.workspace;
    const selection = workspace.selection as DisplayEntitySelection;

    const display   = selection.display;

    // simple check to see if the selection array
    // is an IEntityDisplay
    if (!display) return null;

    const entireBounds = selection.display.bounds;

    const borderWidth = 1 / this.props.zoom;

    const boundsStyle = {
      position: "absolute",
      boxShadow: `0 0 0 ${borderWidth}px #a4b7d7`,
      left: entireBounds.left,
      top: entireBounds.top,

      width: entireBounds.width,
      height: entireBounds.height
    };

    return (<div className="m-selector-component">
      <ResizerComponent {...this.props} strokeWidth={2} selection={selection} onResizing={this.onResizing} onStopResizing={this.onStopResizing} onMoving={this.onMoving} onStopMoving={this.onStopMoving} />

      <div className="m-selector-component--bounds" style={boundsStyle} />

      {this.state.resizing || this.state.moving ? <RulerComponent {...this.props} selection={selection} allEntities={this.props.allEntities} /> : undefined}
      { this.state.resizing ? <SelectionSizeComponent left={this.state.mouseLeft} top={this.state.mouseTop} zoom={this.props.zoom} bounds={entireBounds} /> : undefined}
    </div>);
  }
}

export const dependency = [
  new ReactComponentFactoryDependency("components/tools/pointer/selector", SelectorComponent)
]
