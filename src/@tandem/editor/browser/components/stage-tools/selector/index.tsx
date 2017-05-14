import "./index.scss";
import React =  require("react");
import { Workspace } from "@tandem/editor/browser/stores";
import { flatten } from "lodash";
import RulerComponent from "./ruler";
import ResizerComponent from "./resizer";
import { ContextMenuTypes } from "@tandem/editor/browser/constants";
import { OpenContextMenuRequest } from "@tandem/editor/browser/messages";
import { SelectionSizeComponent } from "@tandem/editor/browser/components/common";
import { BoundingRect, flattenTree } from "@tandem/common";
import { BaseApplicationComponent } from "@tandem/common";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { VisibleSyntheticElementCollection } from "@tandem/editor/browser/collections";

export class SelectorStageToolComponent extends BaseApplicationComponent<{ workspace: Workspace, app: any, zoom: number  }, any> {

  state: any = { }

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

  // onMouseDown = (event: React.MouseEvent<any>) => {
  //   if (event.ctrlKey) {
  //     this.bus.dispatch(new OpenContextMenuRequest(ContextMenuTypes.SYNTHETIC_ELEMENT, event.clientX, event.clientY));
  //   }
  // }

  render() {

    const { workspace } = this.props;
    if (!workspace.showStageTools) return null;

    const selection = VisibleSyntheticElementCollection.create(...(workspace.selection as any)) as VisibleSyntheticElementCollection<any>;


    // simple check to see if the selection array
    // is an IEntityDisplay
    if (!selection.length) return null;

    const entireBounds = selection.getAbsoluteBounds();

    const borderWidth = 1 / this.props.zoom;

    const boundsStyle = {
      position: "absolute",
      top: entireBounds.top,
      left: entireBounds.left,
      width: entireBounds.width,
      height: entireBounds.height,
      boxShadow: `inset 0 0 0 ${borderWidth}px #00B5FF`
    };

    const sections: any = {
      bounds: <div className="m-selector-component--bounds" style={boundsStyle as any} />,
      resizer: <ResizerComponent workspace={this.props.workspace} zoom={this.props.zoom} strokeWidth={2} selection={selection} onResizing={this.onResizing} onStopResizing={this.onStopResizing} onMoving={this.onMoving} onStopMoving={this.onStopMoving} />
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

