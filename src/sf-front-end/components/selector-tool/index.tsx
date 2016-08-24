import "./index.scss";
import * as React from "react";
import { Guider } from "./guider";
import { flatten } from "lodash";
import RulerComponent from "./ruler";
import { BoundingRect } from "sf-core/geom";
import ResizerComponent from "./resizer";
import { Editor, Workspace } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectionSizeComponent } from "sf-front-end/components/selection-size";
import { DisplayEntitySelection } from "sf-front-end/models";
import { IEntityDisplay, IEntity, IVisibleEntity } from "sf-core/entities";
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

    const { workspace, allEntities } = this.props;

    const selection = workspace.selection as DisplayEntitySelection<any>;

    const display   = selection.display;

    // simple check to see if the selection array
    // is an IEntityDisplay
    if (!display) return null;

    const entireBounds = BoundingRect.merge(...flatten(selection.map((entity) => entity.flatten()))
    .filter((entity) => !!entity["display"])
    .map((entity: IVisibleEntity) => entity.display.bounds));

    const borderWidth = 1 / this.props.zoom;

    const boundsStyle = {
      position: "absolute",
      top: entireBounds.top,
      left: entireBounds.left,
      width: entireBounds.width,
      height: entireBounds.height,
      boxShadow: `0 0 0 ${borderWidth}px #a4b7d7`
    };

    const guider = new Guider(allEntities.map((entity: IVisibleEntity) => entity.display && entity.display.bounds).filter((b) => !!b));

    return (<div className="m-selector-component">
      { this.state.moving || this.state.resizing ? undefined : <ResizerComponent {...this.props} guider={guider} strokeWidth={2} selection={selection} onResizing={this.onResizing} onStopResizing={this.onStopResizing} onMoving={this.onMoving} onStopMoving={this.onStopMoving} /> }

      <div className="m-selector-component--bounds" style={boundsStyle} />

      {this.state.resizing || this.state.moving ? <RulerComponent {...this.props} selection={selection} allEntities={this.props.allEntities} /> : undefined}
      { this.state.resizing ? <SelectionSizeComponent left={this.state.mouseLeft} top={this.state.mouseTop} zoom={this.props.zoom} bounds={entireBounds} /> : undefined}
    </div>);
  }
}

export const dependency = [
  new ReactComponentFactoryDependency("components/tools/pointer/selector", SelectorComponent)
];
