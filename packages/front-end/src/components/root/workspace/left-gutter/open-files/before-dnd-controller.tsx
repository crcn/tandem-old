import { compose } from "recompose";
import {
  withNodeDropTarget,
  withHoverVariant,
  WithNodeDropTargetProps
} from "./dnd-controller";
import { TreeMoveOffset } from "tandem-common";

export type Props = WithNodeDropTargetProps;

export default compose<Props, Props>(
  withNodeDropTarget(TreeMoveOffset.BEFORE),
  withHoverVariant
);
