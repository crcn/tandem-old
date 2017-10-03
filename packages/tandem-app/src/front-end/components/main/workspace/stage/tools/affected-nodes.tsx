import "./affected-nodes.scss";
import * as React from "react";
import { shiftBounds } from "aerial-common2";
import { compose, pure } from "recompose";
import { 
  Workspace, 
  SyntheticWindow,
  SyntheticElement,
  SyntheticBrowser, 
  SYNTHETIC_ELEMENT,
  getSyntheticNodeWindow,
  getSyntheticNodeById,
  getSelectorAffectedElements, 
  filterMatchingTargetSelectors, 
} from "front-end/state";

type AffectedNodesToolOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  zoom: number;
};

type AffectedElementOuterProps = {
  element: SyntheticElement;
  window: SyntheticWindow;
  zoom: number;
}

const AffectedElementBase = ({ element, window, zoom }: AffectedElementOuterProps) => {
  const elementBounds = window.allComputedBounds && window.allComputedBounds[element.$id];
  if (!elementBounds) return null;
  const { left, top, right, bottom } = shiftBounds(elementBounds, window.bounds);
  const borderWidth = 1 / zoom;
  const style = {
    boxShadow: `inset 0 0 0 ${borderWidth}px #F5AB35`,
    left,
    top,
    width: right - left,
    height: bottom - top
  };
  return <div className="affected-element" style={style}>
  </div>;
};

const AffectedElement = compose<AffectedElementOuterProps, AffectedElementOuterProps>(
  pure
)(AffectedElementBase);

const AffectedNodesToolBase = ({ workspace, browser, zoom }: AffectedNodesToolOuterProps) => {
  const targetElementRef = workspace.selectionRefs.reverse().find(([$type]) => $type === SYNTHETIC_ELEMENT);
  if (!targetElementRef) {
    return null;
  }

  const targetElement = getSyntheticNodeById(browser, targetElementRef[1]) as SyntheticElement;
  if (!targetElement) {
    return null;
  }
  const targetWindow = getSyntheticNodeWindow(browser, targetElement.$id);
  const affectedElements = getSelectorAffectedElements(filterMatchingTargetSelectors(workspace.targetCSSSelectors, targetElement, targetWindow), browser) as SyntheticElement[];

  return <div className="m-affected-nodes">
    {
      affectedElements.filter(element => element.$id !== targetElement.$id).map((element) => <AffectedElement zoom={zoom} key={element.$id} window={getSyntheticNodeWindow(browser, element.$id)} element={element} />)
    }
  </div>;
};

export const AffectedNodesTool = compose<AffectedNodesToolOuterProps, AffectedNodesToolOuterProps>(
  pure
)(AffectedNodesToolBase);