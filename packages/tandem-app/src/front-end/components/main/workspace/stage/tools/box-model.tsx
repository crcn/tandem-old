import "./box-model.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { Bounds, shiftBounds } from "aerial-common2";
import { Workspace, getNodeArtboard, getWorkspaceNode } from "front-end/state";
import { SlimVMObjectType, SlimElement, getNestedObjectById, SlimCSSStyleDeclaration } from "slim-dom";

export type BoxModelStageToolOuterProps = {
  workspace: Workspace;
  zoom: number;
}

type ElementBoxModelOuterProps = {
  computedStyle: CSSStyleDeclaration;
  bounds: Bounds;
  windowBounds: Bounds;
}

const pxToNumber = (px) => Number(px.replace("px", ""));

const boxShadow = (x: number, y: number, color: string, inset?: boolean) => `${inset ? "inset" : ""} ${x}px ${y}px 0 0px ${color}`;
const paddingBoxShadow = (x: number, y: number) => boxShadow(x, y, '#6EFF27', true);

const ElementBoxModel = compose<ElementBoxModelOuterProps, ElementBoxModelOuterProps>(pure)(({ windowBounds, bounds, computedStyle }: ElementBoxModelOuterProps) => {
  const fixedPosition = shiftBounds(bounds, windowBounds);

  const marginLeft = pxToNumber(computedStyle.marginLeft);
  const marginTop = pxToNumber(computedStyle.marginTop);
  
  const style = {
    left: fixedPosition.left - marginLeft,
    top: fixedPosition.top - marginTop,
    width: fixedPosition.right - fixedPosition.left,
    height: fixedPosition.bottom - fixedPosition.top,
    opacity: 0.3,
    borderColor: "#FF8100",
    borderStyle: "solid",
    boxSizing: "content-box",
    borderLeftWidth: marginLeft,
    borderRightWidth: pxToNumber(computedStyle.marginRight),
    borderTopWidth: marginTop,
    borderBottomWidth: pxToNumber(computedStyle.marginBottom),
    boxShadow: [
      paddingBoxShadow(-pxToNumber(computedStyle.paddingLeft), 0),
      paddingBoxShadow(pxToNumber(computedStyle.paddingRight), 0),
      paddingBoxShadow(0, pxToNumber(computedStyle.paddingTop)),
      paddingBoxShadow(0, -pxToNumber(computedStyle.paddingBottom))
    ].join(", ")    
  };

  return <div className="element-box-model" style={style}>
  </div>;
});


export const BoxModelStageTool = compose<BoxModelStageToolOuterProps, BoxModelStageToolOuterProps>(pure)(({ workspace }: BoxModelStageToolOuterProps) => {
  const selectedElements = workspace.selectionRefs.filter(([type]) => type === SlimVMObjectType.ELEMENT).map(([type, $id]) => getWorkspaceNode($id, workspace)).filter((element) => !!element) as SlimElement[];

  if (selectedElements.length === 0) {
    return null;
  }

  return <div className="m-box-model-tool">
    {
      selectedElements.map((element) => {
        const window = getNodeArtboard(element.id, workspace);
        const bounds = window.computedDOMInfo && window.computedDOMInfo[element.id] && window.computedDOMInfo[element.id].bounds;
        const style = window.computedDOMInfo && window.computedDOMInfo[element.id] && window.computedDOMInfo[element.id].style;
        if (!bounds || !style) {
          return null;
        }
        return <ElementBoxModel key={element.id} windowBounds={window.bounds} bounds={bounds} computedStyle={style} />;
      })
    }
  </div>;
});