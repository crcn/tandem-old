/*
TODO:

- respect padding
- respect margin
- check flexbox
- respect align-content
*/
import {
  getSyntheticNodeById,
  SyntheticBrowser,
  getSyntheticNodeBounds,
  SyntheticNode,
  getSyntheticNodeDocument,
  SyntheticDocument
} from "./synthetic";
import {
  Point,
  getAttribute,
  getParentTreeNode,
  memoize,
  findTreeNodeParent,
  Bounds,
  TreeNode,
  shiftBounds,
  moveBounds
} from "tandem-common";
import { negate } from "lodash";

enum Axis {
  X,
  Y
}

const getStyleProp = (
  node: TreeNode<any, any>,
  prop: string,
  defaultValue: string
) => {
  const style = getAttribute(node, "style");
  return (style && style[prop]) || defaultValue;
};

export const isRelativeNode = (node: TreeNode<any, any>) =>
  /relative|absolute|fixed/i.test(getStyleProp(node, "position", "static"));
export const isAbsolutelyPositionedNode = (node: TreeNode<any, any>) =>
  /absolute|fixed/i.test(getStyleProp(node, "position", "static"));
export const getRelativeParent = memoize(
  (node: SyntheticNode, document: SyntheticDocument) => {
    return (
      findTreeNodeParent(node.id, document.root, isRelativeNode) ||
      document.root
    );
  }
);

const measurementToPx = (
  measurment: string,
  axis: Axis,
  node: SyntheticNode,
  document: SyntheticDocument
) => {
  if (!measurment || measurment === "auto") {
    return 0;
  }

  const [match, value, unit] = measurment.match(/([-\d\.]+)(.+)/);
  if (unit === "px") {
    return Number(value);
  }

  throw new Error(`Cannot convert ${unit} to absolute`);
};

export const getFixedSyntheticNodeStaticPosition = memoize(
  (node: SyntheticNode, document: SyntheticDocument): Point => {
    const position = getAttribute(node, "position");
    if (position === "fixed" || document.root.id === node.id) {
      return {
        left: 0,
        top: 0
      };
    }

    if (position === "absolute") {
      const relativeParent = getRelativeParent(node, document);
      return document.computed[relativeParent.id].bounds;
    }

    return {
      left:
        document.computed[node.id].bounds.left -
        measurementToPx(
          document.computed[node.id].style.left,
          Axis.X,
          node,
          document
        ),
      top:
        document.computed[node.id].bounds.top -
        measurementToPx(
          document.computed[node.id].style.top,
          Axis.Y,
          node,
          document
        )
    };
  }
);

export const convertFixedBoundsToRelative = (
  bounds: Bounds,
  node: SyntheticNode,
  document: SyntheticDocument
) => {
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

export const convertFixedBoundsToNewAbsoluteRelativeToParent = (
  bounds: Bounds,
  newParent: SyntheticNode,
  document: SyntheticDocument
) => {
  const relativeParent = isRelativeNode(newParent)
    ? newParent
    : getRelativeParent(newParent, document);
  const relativeParentBounds = document.computed[relativeParent.id].bounds;

  // based on abs parent of new child.
  return moveBounds(bounds, {
    left: bounds.left - relativeParentBounds.left,
    top: bounds.top - relativeParentBounds.top
  });
};
