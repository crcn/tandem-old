/*
TODO:

- respect padding
- respect margin
- check flexbox
- respect align-content
*/
import { SyntheticNode, SyntheticFrame } from "./synthetic";
import {
  Point,
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
  node: SyntheticNode,
  prop: string,
  defaultValue?: string
) => {
  const style = node.style;
  return (style && style[prop]) || defaultValue;
};

export const isRelativeNode = (node: SyntheticNode) =>
  /relative|absolute|fixed/i.test(getStyleProp(node, "position", "static"));
export const isAbsolutelyPositionedNode = (node: SyntheticNode) =>
  /absolute|fixed/i.test(getStyleProp(node, "position", "static"));
export const getRelativeParent = memoize(
  (node: SyntheticNode, frame: SyntheticFrame) => {
    return (
      findTreeNodeParent(node.id, frame.root, isRelativeNode) || frame.root
    );
  }
);

const measurementToPx = (
  measurment: string,
  axis: Axis,
  node: SyntheticNode,
  frame: SyntheticFrame
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
  (node: SyntheticNode, frame: SyntheticFrame): Point => {
    const position = getStyleProp(node, "position");
    if (position === "fixed" || frame.root.id === node.id) {
      return {
        left: 0,
        top: 0
      };
    }

    if (position === "absolute") {
      const relativeParent = getRelativeParent(node, frame);
      return frame.computed[relativeParent.id].bounds;
    }

    return {
      left:
        frame.computed[node.id].bounds.left -
        measurementToPx(
          frame.computed[node.id].style.left,
          Axis.X,
          node,
          frame
        ),
      top:
        frame.computed[node.id].bounds.top -
        measurementToPx(frame.computed[node.id].style.top, Axis.Y, node, frame)
    };
  }
);

export const convertFixedBoundsToRelative = (
  bounds: Bounds,
  node: SyntheticNode,
  frame: SyntheticFrame
) => {
  const staticPosition = getFixedSyntheticNodeStaticPosition(node, frame);
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
  frame: SyntheticFrame
) => {
  const relativeParent = isRelativeNode(newParent)
    ? newParent
    : getRelativeParent(newParent, frame);
  const relativeParentBounds = frame.computed[relativeParent.id].bounds;

  // based on abs parent of new child.
  return moveBounds(bounds, {
    left: bounds.left - relativeParentBounds.left,
    top: bounds.top - relativeParentBounds.top
  });
};
