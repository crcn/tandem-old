import "./static-position.scss";
import { Bounds, shiftBounds, moveBounds, Point } from "aerial-common2";
import { compose, pure } from "recompose";
import * as React from "react";
import { 
  Workspace, 
  SyntheticElement, 
  getComputedStyle,
  SyntheticBrowser, 
  SYNTHETIC_ELEMENT, 
  getSyntheticNodeById,
  getSyntheticNodeWindow,
  getSyntheticNodeAncestors,
} from "front-end/state";

import { convertElementMeasurementToNumber, Axis } from "aerial-browser-sandbox";

export type StaticPositionStageToolOuterProps = {
  zoom: number;
  browser: SyntheticBrowser;
  workspace: Workspace;
};

type ElementStaticPositionOuterProps = {
  zoom: number;
  position: Point;
  windowPosition: Point;
  elementBounds: Bounds;
  element: SyntheticElement;
};

const ElementStaticPositionInfo = compose<ElementStaticPositionOuterProps, ElementStaticPositionOuterProps>(pure)(({ windowPosition, element, elementBounds, zoom, position }: ElementStaticPositionOuterProps) => {

  const borderScale = zoom / 1;
  
  const staticBounds = shiftBounds(elementBounds, {
    left: -position.left,
    top: -position.top
  });

  const style = {
    left: windowPosition.left + staticBounds.left,
    top: windowPosition.top + staticBounds.top,
    width: staticBounds.right - staticBounds.left,
    height: staticBounds.bottom - staticBounds.top,
    boxShadow: `0 0 0 ${borderScale}px #FF00FF`
  };

  return <div className="element-static-position" style={style}>
  </div>;
});

// TODO - use hotkey toggle to show this component. It shouldn't be on by default

export const StaticPositionStageToolBase = ({ zoom, workspace, browser }: StaticPositionStageToolOuterProps) => {


  // do nothing for now. Need to wire this up with a hotkey flag, 
  // and need to show when CSS properties are mutated.
  return null;

  // const selectedElementRefs = workspace.selectionRefs.filter(([type]) => type === SYNTHETIC_ELEMENT);

  // const selectedElements = selectedElementRefs.map(([type, $id]) => getSyntheticNodeById(browser, $id)).filter((element) => !!element) as SyntheticElement[];
  // if (selectedElements.length === 0) return null;

  // return <div className="m-static-position">
  //   {
  //     selectedElements.map((element) => {
  //       const window = getSyntheticNodeWindow(browser, element.$id);
  //       const elementBounds = window.allComputedBounds[element.$id];
  //       const computedStyle = getComputedStyle(element.$id, window);

  //       const position = {
  //         left: convertElementMeasurementToNumber(element, computedStyle.left, Axis.HORIZONTAL, window),
  //         top: convertElementMeasurementToNumber(element, computedStyle.top, Axis.HORIZONTAL, window),
  //       };
        
  //       return <ElementStaticPositionInfo windowPosition={window.bounds} key={element.$id} element={element} elementBounds={elementBounds} zoom={zoom} position={position} />
  //     })
  //   }
  // </div>;
}

export const StaticPositionStageTool = compose<StaticPositionStageToolOuterProps, StaticPositionStageToolOuterProps>(
  pure
)(StaticPositionStageToolBase);