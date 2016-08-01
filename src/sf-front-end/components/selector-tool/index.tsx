import "./index.scss";
import * as React from "react";
import ResizerComponent from "./resizer/index";
import { Editor } from "sf-front-end/models";
import { IEntityDisplay } from "sf-core/entities";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

export default class SelectorComponent extends React.Component<{ editor: any }, any> {

  render() {

    const { selection } = this.props.editor;

    const display   = selection.display;

    // simple check to see if the selection array
    // is an IEntityDisplay
    if (!display) return null;

    const sections: any = {};

    const entireBounds = selection.display.bounds;

    const boundsStyle = {
      position: "absolute",
      left: entireBounds.left + 1,
      top: entireBounds.top + 1,
      width: entireBounds.width - 1,
      height: entireBounds.height - 1,
    };

    return (<div className="m-selector-component">
      <ResizerComponent {...this.props} />
      <div className="m-selector-component--bounds" style={boundsStyle} />
      {sections.guides}
      {sections.size}
    </div>);
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/pointer/selector", SelectorComponent);
