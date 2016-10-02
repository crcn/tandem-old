import "./index.scss";
import * as React from "react";
import { flatten } from "lodash";
import RulerComponent from "./ruler";
import { PointerTool } from "@tandem/front-end/models/pointer-tool";
import { BoundingRect } from "@tandem/common/geom";
import ResizerComponent from "./resizer";
import { Editor, Workspace } from "@tandem/front-end/models";
import { FrontEndApplication } from "@tandem/front-end/application";
import { SelectionSizeComponent } from "@tandem/front-end/components/selection-size";
import { VisibleEntityCollection } from "@tandem/front-end/collections";
import { ReactComponentFactoryDependency } from "@tandem/front-end/dependencies";
import { IEntityDisplay, IEntity, IVisibleEntity } from "@tandem/common/lang/entities";

export default class SelectorComponent extends React.Component<{ editor: Editor, tool: PointerTool, workspace: Workspace, app: FrontEndApplication, zoom: number, allEntities: Array<IEntity> }, any> {

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

    const { workspace, editor, allEntities, tool } = this.props;

    if (!(tool instanceof PointerTool)) return null;

    const selection = new VisibleEntityCollection(...editor.selection);

    // simple check to see if the selection array
    // is an IEntityDisplay
    if (!selection.length) return null;

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
