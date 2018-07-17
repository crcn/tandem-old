import { compose } from "recompose";
import { withNodeDropTarget, withHoverVariant } from "./dnd-controller";
import { TreeMoveOffset } from "tandem-common";

export default compose(
  withNodeDropTarget(TreeMoveOffset.BEFORE),
  withHoverVariant
);
