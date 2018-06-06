import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import {
  RootState,
  SyntheticVisibleNodeMetadataKeys
} from "../../../../../../../state";
import {
  SyntheticVisibleNode,
  Frame,
  SyntheticElement,
  SyntheticDocument
} from "paperclip";
import { compose, pure, withHandlers } from "recompose";
import {
  createTreeLayerComponents,
  TreeNodeLayerOuterProps,
  defaultChildRender
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

const isMovableNode = ({ node, inComponentInstance }: any) => {
  const sn = node as SyntheticVisibleNode;
  return !node.immutable;
};

const canDropNode = (
  child: SyntheticVisibleNode,
  { node, inComponentInstance }: any,
  offset: TreeMoveOffset
) => {
  if (child.isContentNode) {
    if (child.isCreatedFromComponent) {
      if (child.isComponentInstance) {
        return true;
      } else if (offset !== TreeMoveOffset.APPEND && node.isContentNode) {
        return true;
      } else {
        return false;
      }
    }
  }
  return true;
};

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
    attributeOptions: {
      nodeLabelAttr: (node: SyntheticVisibleNode) => node.label,
      expandAttr: (node: SyntheticVisibleNode) =>
        node.metadata[SyntheticVisibleNodeMetadataKeys.EXPANDED],
      editingLabelAttr: (node: SyntheticVisibleNode) =>
        node.metadata[SyntheticVisibleNodeMetadataKeys.EDITING_LABEL]
    },
    canDrop: canDropNode,
    canDrag: isMovableNode,
    dragType: DRAG_TYPE,
    getLabelProps: (attribs, props: any) => ({
      ...attribs,
      className: cx(attribs.className, {
        "is-component-instance": props.node.isComponentInstance,
        immutable: props.node.immutable,
        "is-component-root":
          props.isContentNode &&
          props.node.isCreatedFromComponent &&
          !props.node.isComponentInstance
      })
    }),
    layerRenderer: Base => (props: PCLayerOuterProps) => {
      return (
        <Base
          {...props}
          isContentNode={(props.node as SyntheticVisibleNode).isContentNode}
        />
      );
    }
  }
);

type FrameLayersOuterProps = {
  document: SyntheticDocument;
  hoveringNodeIds: string[];
  selectedReferences: string[];
  dispatch: Dispatch<any>;
  // window: Frame;
  frames: Frame[];
};

type FrameLayersInnerProps = {} & FrameLayersOuterProps;

const BaseFrameLayersComponent = ({
  hoveringNodeIds,
  selectedReferences,
  dispatch,
  frames,
  document
}: FrameLayersInnerProps) => {
  return (
    <div className="m-synthetic-window-layers">
      {frames.map(frame => {
        return (
          <TreeNodeLayerComponent
            key={frame.contentNodeId}
            node={getNestedTreeNodeById(frame.contentNodeId, document)}
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

export const FrameLayersComponent = compose<
  FrameLayersInnerProps,
  FrameLayersOuterProps
>(pure)(BaseFrameLayersComponent);
