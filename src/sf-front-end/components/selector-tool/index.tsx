import "./index.scss";
import * as React from "react";
import ResizerComponent from "./resizer";
import { Editor } from "sf-front-end/models";
import { DisplayEntityCollection } from "sf-front-end/selection";
import { IEntityDisplay } from "sf-core/entities";
import { FrontEndApplication } from "sf-front-end/application";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

export default class SelectorComponent extends React.Component<{ editor: Editor, app: FrontEndApplication, zoom: number }, any> {

  render() {

    const editor = this.props.editor;
    const selection = editor.selection as DisplayEntityCollection;

    const display   = selection.display;

    // simple check to see if the selection array
    // is an IEntityDisplay
    if (!display) return null;

    const sections: any = {};

    const entireBounds = selection.display.bounds.zoom(this.props.zoom);

    const boundsStyle = {
      position: "absolute",
      left: entireBounds.left,
      top: entireBounds.top,
      width: entireBounds.width - 1,
      height: entireBounds.height - 1
    };

    return (<div className="m-selector-component">
      <ResizerComponent {...this.props} selection={selection} />
      <div className="m-selector-component--bounds" style={boundsStyle} />
      {sections.guides}
      {sections.size}
    </div>);
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/pointer/selector", SelectorComponent);
