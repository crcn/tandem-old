import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { RootState } from "../../../../../../../state";
import { SyntheticNode, SyntheticFrame, SyntheticElement } from "paperclip";
import { compose, pure, withHandlers } from "recompose";
import {
  createTreeLayerComponents,
  TreeNodeLayerOuterProps
} from "../../../../../../layers";
import {
  EMPTY_ARRAY,
  getNestedTreeNodeById,
  TreeNode,
  TreeMoveOffset
} from "tandem-common";
import { Dispatch } from "redux";
import {
  pcLayerClick,
  pcLayerMouseOut,
  pcEditLayerLabelBlur,
  pcLayerMouseOver,
  pcLayerLabelChanged,
  pcLayerDoubleClick,
  pcLayerExpandToggleClick,
  pcLayerDroppedNode,
  RESIZER_STOPPED_MOVING
} from "../../../../../../../actions";
import { StructReference } from "tandem-common";

const DRAG_TYPE = "SYNTHETIC_NODE";

type PCLayerOuterProps = {
  inComponentInstance?: boolean;
} & TreeNodeLayerOuterProps;

const isMovableNode = (node: SyntheticNode) =>
  !node.isRoot || node.isComponentInstance;

const { TreeNodeLayerComponent } = createTreeLayerComponents<PCLayerOuterProps>(
  {
    actionCreators: {
      treeLayerDroppedNode: pcLayerDroppedNode,
      treeLayerClick: pcLayerClick,
      treeLayerExpandToggleClick: pcLayerExpandToggleClick,
      treeLayerMouseOut: pcLayerMouseOut,
      treeLayerMouseOver: pcLayerMouseOver,
      treeLayerDoubleClick: pcLayerDoubleClick,
      treeLayerLabelChanged: pcLayerLabelChanged,
      treeLayerEditLabelBlur: pcEditLayerLabelBlur
    },
    canDrop(
      child: SyntheticNode,
      near: SyntheticNode,
      offset: number,
      root: SyntheticNode
    ) {
      if (offset === TreeMoveOffset.APPEND) {
        if (
          !child.isRoot &&
          (!near.isCreatedFromComponent || near.name !== "text")
        ) {
          return true;
        }
      }

      // sibling
      return !near.isCreatedFromComponent;
    },
    canDrag: isMovableNode,
    dragType: DRAG_TYPE,
    getLabelProps: (attribs, props: any) => ({
      ...attribs,
      className: cx(attribs.className, {
        "in-component-instance":
          props.node.isCreatedFromComponent || props.node.isComponentInstance,
        "is-component-root": props.isComponentRoot
      })
    }),
    layerRenderer: Base => (props: PCLayerOuterProps) => {
      return (
        <Base
          {...props}
          isComponentRoot={(props.node as SyntheticNode).isRoot}
        />
      );
    }
  }
);

type SyntheticFrameLayersOuterProps = {
  hoveringNodeIds: string[];
  selectedReferences: string[];
  dispatch: Dispatch<any>;
  // window: SyntheticFrame;
  frames: SyntheticFrame[];
};

type SyntheticFrameLayersInnerProps = {} & SyntheticFrameLayersOuterProps;

const BaseSyntheticFrameLayersComponent = ({
  hoveringNodeIds,
  selectedReferences,
  dispatch,
  frames
}: SyntheticFrameLayersInnerProps) => {
  return (
    <div className="m-synthetic-window-layers">
      {frames.map(frame => {
        return (
          <TreeNodeLayerComponent
            key={frame.source.nodeId}
            node={frame.root}
            depth={0}
            hoveringNodeIds={hoveringNodeIds}
            selectedNodeIds={selectedReferences}
            dispatch={dispatch}
          />
        );
      })}
    </div>
  );
};

export const SyntheticFrameLayersComponent = compose<
  SyntheticFrameLayersInnerProps,
  SyntheticFrameLayersOuterProps
>(pure)(BaseSyntheticFrameLayersComponent);
