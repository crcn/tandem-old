import "./box-model.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { Bounds, shiftBounds } from "aerial-common2";
import { Workspace, SyntheticBrowser, SyntheticElement, SYNTHETIC_ELEMENT, getSyntheticNodeById, getSyntheticNodeWindow } from "front-end/state";

export type BoxModelStageToolOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
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
      paddingBoxShadow(0, -pxToNumber(computedStyle.paddingTop)),
      paddingBoxShadow(0, pxToNumber(computedStyle.paddingBottom))
    ].join(", ")    
  };

  return <div className="element-box-model" style={style}>
  </div>;
});


export const BoxModelStageTool = compose<BoxModelStageToolOuterProps, BoxModelStageToolOuterProps>(pure)(({ workspace, browser }: BoxModelStageToolOuterProps) => {
  const selectedElements = workspace.selectionRefs.filter(([type]) => type === SYNTHETIC_ELEMENT).map(([type, $id]) => getSyntheticNodeById(browser, $id)).filter((element) => !!element) as SyntheticElement[];

  if (selectedElements.length === 0) {
    return null;
  }

  return <div className="m-box-model-tool">
    {
      selectedElements.map((element) => {
        const window = getSyntheticNodeWindow(browser, element.$id);
        const bounds = window.allComputedBounds && window.allComputedBounds[element.$id];
        const style = window.allComputedStyles && window.allComputedStyles[element.$id];
        if (!bounds || !style) {
          return null;
        }
        return <ElementBoxModel key={element.$id} windowBounds={window.bounds} bounds={bounds} computedStyle={style} />;
      })
    }
  </div>;
});