/*
TODO:

- respect padding
- respect margin
- check flexbox
- respect align-content
*/
import { getSyntheticNodeById, SyntheticBrowser, getSyntheticNodeBounds, SyntheticNode, getSyntheticNodeDocument, SyntheticDocument } from "./synthetic";
import { Point, getAttribute, getParentTreeNode, memoize, findTreeNodeParent, Bounds, TreeNode, shiftBounds, moveBounds } from "../common";
import { negate } from "lodash";

const getStyleProp = (node: TreeNode, prop: string, defaultValue: string) => {
  const style = getAttribute(node, "style");
  return style && style[prop] || defaultValue;
}

const isRelativeNode = (node: TreeNode) => /relative|absolute|fixed/i.test(getStyleProp(node, "position", "static"));
const isAbsolutelyPositionedNode = (node: TreeNode) => /absolute|fixed/i.test(getStyleProp(node, "position", "static"));

enum Axis { X, Y };

const getRelativeParent = memoize((node: SyntheticNode, document: SyntheticDocument) => {
  return findTreeNodeParent(node.id, document.root, isRelativeNode) || document.root;
});

const measurementToPx = (measurment: string, axis: Axis, node: SyntheticNode, document: SyntheticDocument) => {

  if(!measurment || measurment === "auto") {
    return 0;
  }

  const [match, value, unit] = measurment.match(/([-\d\.]+)(.+)/);
  if (unit === "px") {
    return Number(value);
  }

  throw new Error(`Cannot convert ${unit} to absolute`);
};

export const getFixedSyntheticNodeStaticPosition = memoize((node: SyntheticNode, document: SyntheticDocument): Point => {

  const position = getAttribute(node, "position");

  if (position === "absolute") {
    const relativeParent = getRelativeParent(node, document);
    return document.computed[relativeParent.id].bounds;
  }

  if (position === "fixed") {
    return {
      left: 0,
      top: 0
    };
  }

  return {
    left: document.computed[node.id].bounds.left - measurementToPx(document.computed[node.id].style.left, Axis.X, node, document),
    top: document.computed[node.id].bounds.top - measurementToPx(document.computed[node.id].style.top, Axis.Y, node, document)
  };
});

export const convertFixedBoundsToRelative = (bounds: Bounds, node: SyntheticNode, document: SyntheticDocument) => {
  const staticPosition = getFixedSyntheticNodeStaticPosition(node, document);
  return shiftBounds(bounds, {
    left: -staticPosition.left,
    top: -staticPosition.top
  });
};

/**
 * Used to maintian the same position of a node when it's moved to another parent.  This function
 * assumes that the node is translated to be absolutely positioned since there moving a relatively positioned
 * element to a parent will have cascading affects to other children. We don't want that. Also, moving a relatively
 * positioned element to another parent would need to consider the layout engine (we don't have access to that directly), so
 * the static position of the element cannot easily be computed (unless we want to mock the DOM 😅).
 */

export const convertFixedBoundsToNewAbsoluteRelativeToParent = (bounds: Bounds, node: SyntheticNode, newParent: SyntheticNode, document: SyntheticDocument) => {
  if (getStyleProp(node, "position", "static") === "fixed") {
    return bounds;
  }

  const relativeParent = isRelativeNode(newParent) ? newParent : getRelativeParent(newParent, document);
  const relativeParentBounds = document.computed[relativeParent.id].bounds;

  // based on abs parent of new child.
  return moveBounds(bounds, {
    left: bounds.left - relativeParentBounds.left,
    top: bounds.top - relativeParentBounds.top
  });
};