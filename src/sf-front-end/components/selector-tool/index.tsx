import "./index.scss";
import * as React from "react";
import ResizerComponent from "./resizer";
import { Editor } from "sf-front-end/models";
import { DisplayEntityCollection } from "sf-front-end/selection";
import { IEntityDisplay, IEntity } from "sf-core/entities";
import { FrontEndApplication } from "sf-front-end/application";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";
import RulerComponent from "./ruler";

export default class SelectorComponent extends React.Component<{ editor: Editor, app: FrontEndApplication, zoom: number, allEntities: Array<IEntity> }, any> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onResizing = () => {
    this.setState({ resizing: true });
  }

  onStopResizing = () => {
    this.setState({ resizing: false });
  }

  render() {

    const editor = this.props.editor;
    const selection = editor.selection as DisplayEntityCollection;

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
      <ResizerComponent {...this.props} strokeWidth={2} selection={selection} onResizing={this.onResizing} onStopResizing={this.onStopResizing} />

      <div className="m-selector-component--bounds" style={boundsStyle} />

      {this.state.resizing ? <RulerComponent {...this.props} selection={selection} allEntities={this.props.allEntities} /> : undefined}
    </div>);
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/pointer/selector", SelectorComponent);
