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
  if (sn.isContentNode) {
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
  child: SyntheticVisibleNode,
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
        "in-component-instance":
          props.inComponentInstance && props.node.isCreatedFromComponent,
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
    },
    childRenderer: Base => {
      const childRenderer = defaultChildRender(Base);
      return (props: PCLayerOuterProps) => {
        return childRenderer({
          ...props,
          inComponentInstance:
            props.inComponentInstance ||
            (props.node as SyntheticVisibleNode).isComponentInstance
        } as any);
      };
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
