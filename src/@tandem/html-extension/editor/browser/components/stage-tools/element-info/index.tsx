import "./index.scss";
import "@tandem/uikit";

import React =  require("react");
import { Workspace } from "@tandem/editor/browser/stores";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { fitBoundsInDocument } from "@tandem/editor/browser/utils";
import { calculateCSSMeasurments } from "@tandem/common";
import { SyntheticHTMLElement, SyntheticDOMElement } from "@tandem/synthetic-browser";

// TODO - add attribute information here so that the user
// knows what they're hovering on. OR, highlight the line in code.
const MAX_TOOLTIP_COUNT = 10;
class ElementInfoComponent extends React.Component<{ element: SyntheticHTMLElement, workspace: Workspace, hoverCount: number }, any> {

  render() {
    const { element, workspace } = this.props;
    const rect = fitBoundsInDocument(element);
    const computedStyle = element.getComputedStyle();
    if (!computedStyle) return null;

    const {left, top, scale } = workspace.transform;

    const style = {
      left: rect.left,
      top: rect.top,
      position: "absolute"
    };

    const styleInner = {
      top: 0,
      left: 0,
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

    let tagInfo = element.tagName;

    if (element.getAttribute("id")) {
      tagInfo += "#" + element.getAttribute("id");
    }

    if (element.getAttribute("class")) {
      tagInfo += "." + element.getAttribute("class").trim().split(/\s+/g).join(".");
    }

    const tagInfoStyle = {
      transform: `translateY(-${1/scale * 100}%) scale(${1/scale})`,
      minWidth: 80,
      transformOrigin: "top left",

      // don't want too many tooltips to show
      display: this.props.hoverCount < MAX_TOOLTIP_COUNT ? "block" : "none"
    }

    return <div className="td-html-element-info-item" style={style as any}>
      <div className="td-html-tag-info selected" style={tagInfoStyle}>{tagInfo} &brvbar; { Math.round(rect.width) }  &times; { Math.round(rect.height) }</div>
      <div style={styleInner as any}>
        <div className="td-html-padding-info" style={paddingStyle}></div>
        <div className="td-html-margin-info" style={marginStyle}></div>
      </div>
    </div>;
  }
}

export interface IElementInfoStageToolComponentProps {
  workspace: Workspace;
  allElements: SyntheticDOMElement[];
}

export class ElementInfoStageToolComponent extends React.Component<IElementInfoStageToolComponentProps, any> {
  shouldComponentUpdate({ allElements }: IElementInfoStageToolComponentProps) {
    return this.props.allElements !== allElements;
  }
  render() {
    const { workspace, allElements } = this.props;
    const htmlElements = allElements.filter(element => {
      return element.metadata.get(MetadataKeys.HOVERING);
    });

    return <div className="td-html-element-info">
      { htmlElements.map((element) => <ElementInfoComponent hoverCount={htmlElements.length} element={element as SyntheticHTMLElement} workspace={workspace} key={element.uid} />)}
    </div>;
  }
}