import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import {
  RootState,
  SyntheticNodeMetadataKeys
} from "../../../../../../../state";
import { SyntheticNode, SyntheticFrame, SyntheticElement } from "paperclip";
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
  const sn = node as SyntheticNode;
  if (sn.isRoot) {
    if (sn.isCreatedFromComponent) {
      return sn.isComponentInstance;
    }
    return true;
  }

  if (node.isCreatedFromComponent && inComponentInstance) {
    return false;
  }

  return true;
};

const canDropNode = (
  child: SyntheticNode,
  { node, inComponentInstance }: any,
  offset: TreeMoveOffset
) => {
  // override children
  if (inComponentInstance) {
    return true;
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
      nodeLabelAttr: (node: SyntheticNode) => node.label,
      expandAttr: (node: SyntheticNode) =>
        node.metadata[SyntheticNodeMetadataKeys.EXPANDED],
      editingLabelAttr: (node: SyntheticNode) =>
        node.metadata[SyntheticNodeMetadataKeys.EDITING_LABEL]
    },
    canDrop: canDropNode,
    canDrag: isMovableNode,
    dragType: DRAG_TYPE,
    getLabelProps: (attribs, props: any) => ({
      ...attribs,
      className: cx(attribs.className, {
        "is-component-instance": props.node.isComponentInstance,
        "in-component-instance": props.inComponentInstance,
        "is-component-root":
          props.isRoot &&
          props.node.isCreatedFromComponent &&
          !props.node.isComponentInstance
      })
    }),
    layerRenderer: Base => (props: PCLayerOuterProps) => {
      return <Base {...props} isRoot={(props.node as SyntheticNode).isRoot} />;
    },
    childRenderer: Base => {
      const childRenderer = defaultChildRender(Base);
      return (props: PCLayerOuterProps) => {
        return childRenderer({
          ...props,
          inComponentInstance:
            props.inComponentInstance ||
            (props.node as SyntheticNode).isComponentInstance
        } as any);
      };
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
