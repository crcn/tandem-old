import "./index.scss";

import * as React from "react";
import { Workspace } from "@tandem/editor/models";
import { MetadataKeys } from "@tandem/editor/constants";
import { calculateCSSMeasurments } from "@tandem/common";
import {
  SyntheticHTMLElement,
  BaseVisibleDOMNodeEntity,
} from "@tandem/synthetic-browser";

class ElementInfoComponent extends React.Component<{ entity: BaseVisibleDOMNodeEntity<SyntheticHTMLElement, any>, workspace: Workspace }, any> {


  render() {
    const { entity, workspace } = this.props;
    const rect = entity.source.getBoundingClientRect();
    const computedStyle = entity.getComputedStyle();
    if (!computedStyle) return null;

    const scale = workspace.transform.scale;

    const style = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      position: "absolute"
    };

    const {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,

      marginLeft,
      marginRight,
      marginTop,
      marginBottom
    } = calculateCSSMeasurments(computedStyle);

    const paddingStyle = {
      borderLeftWidth: paddingLeft,
      borderRightWidth: paddingRight,
      borderTopWidth: paddingTop,
      borderBottomWidth: paddingBottom
    };

    const marginStyle = {
      borderLeftWidth: marginLeft,
      borderRightWidth: marginRight,
      borderTopWidth: marginTop,
      borderBottomWidth: marginBottom,
      left: -marginLeft,
      top: -marginTop,
      width: `calc(100% + ${marginLeft + marginRight}px)`,
      height: `calc(100% + ${marginTop + marginBottom}px)`
    };

    return <div className="td-html-element-info-item" style={style}>
      <div className="td-html-padding-info" style={paddingStyle}></div>
      <div className="td-html-margin-info" style={marginStyle}></div>
    </div>;
  }
}

export class ElementInfoStageToolComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { workspace } = this.props;
    const entities = workspace.document.querySelectorAll("*").filter((node) => node.native && (node.native as any).getBoundingClientRect && (node as SyntheticHTMLElement).dataset[MetadataKeys.HOVERING]);

    return <div className="td-html-element-info">
      { entities.map((entity) => <ElementInfoComponent entity={entity as any} workspace={workspace} key={entity.uid} />)}
    </div>;
  }
}