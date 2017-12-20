import "./affected-nodes.scss";
import * as React from "react";
import { shiftBounds } from "aerial-common2";
import { compose, pure } from "recompose";
import { 
  Workspace, 
  SyntheticWindow,
  SyntheticElement,
  SyntheticBrowser, 
  Artboard,
  SYNTHETIC_ELEMENT,
  getSyntheticNodeWindow,
  getSyntheticNodeById,
  getNodeArtboard,
  getWorkspaceNode,
  getSelectorAffectedElements, 
  filterMatchingTargetSelectors, 
} from "front-end/state";
import { getNestedObjectById, Element } from "slim-dom";

type AffectedNodesToolOuterProps = {
  workspace: Workspace;
  zoom: number;
};

type AffectedElementOuterProps = {
  element: Element;
  artboard: Artboard;
  zoom: number;
}

const AffectedElementBase = ({ element, artboard, zoom }: AffectedElementOuterProps) => {
  const computedInfo = artboard.computedDOMInfo && artboard.computedDOMInfo[element.id];
  if (!computedInfo) return null;
  const { left, top, right, bottom } = shiftBounds(computedInfo.bounds, artboard.bounds);
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

const AffectedNodesToolBase = ({ workspace, zoom }: AffectedNodesToolOuterProps) => {
  const targetElementRef = workspace.selectionRefs.reverse().find(([$type]) => $type === SYNTHETIC_ELEMENT);

  if (!targetElementRef) {
    return null;
  }

  const targetElement = getWorkspaceNode(targetElementRef[1], workspace) as Element;

  if (!targetElement) {
    return null;
  }

  const targetArtboard = getNodeArtboard(targetElement.id, workspace);
  const affectedElements = []; // getSelectorAffectedElements(targetElement.id, filterMatchingTargetSelectors(workspace.targetCSSSelectors, targetElement, targetWindow), browser, !!workspace.stage.fullScreen) as SyntheticElement[];

  return <div className="m-affected-nodes">
    {
      affectedElements.filter(element => element.id !== targetElement.id).map((element) => <AffectedElement zoom={zoom} key={element.$id} artboard={getNodeArtboard(element.id, workspace)} element={element} />)
    }
  </div>;
};

export const AffectedNodesTool = compose<AffectedNodesToolOuterProps, AffectedNodesToolOuterProps>(
  pure
)(AffectedNodesToolBase);