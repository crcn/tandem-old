import "./index.scss";

import * as React from "react";
import { flatten } from "lodash";
import { Editor } from "sf-front-end/models";
import RulerComponent from "./ruler/index";
import GuideComponent from "./guide/index";
import ResizerComponent from "./resizer/index";
import BoundingRect from "sf-core/geom/bounding-rect";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies/index";

export default class SelectorComponent extends React.Component<{ editor: any }, any> {

  constructor() {
    super();
    this.state = {
      moving: false,
    };
  }

  get targetPreview() {
    return this.props.editor.selection.display;
  }

  render() {

    const { selection } = this.props.editor;

    const display   = selection.display;
    if (!display) return null;

    const sections: any = {};

    if (this.targetPreview.moving) {
      sections.guides = (<div>
        <RulerComponent {...this.props} />
        {this.state.dragBounds ? <GuideComponent {...this.props} bounds={this.state.dragBounds} /> : void 0}
      </div>);
    }

    const allBounds = [];

    selection.forEach(function(entity) {
      entity.flatten().forEach(function(childEntity) {
        if (childEntity.preview) allBounds.push(childEntity.preview);
      });
    });

    const entireBounds = BoundingRect.merge(...allBounds);

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
