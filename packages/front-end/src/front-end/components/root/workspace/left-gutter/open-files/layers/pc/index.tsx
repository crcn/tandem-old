import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { RootState } from "../../../../../../../state";
import { SyntheticWindow, SyntheticBrowser, SyntheticNode, SyntheticDocument, SyntheticObjectType, EDITOR_NAMESPACE, EditorAttributeNames, PCSourceAttributeNames, getComponentInstanceSyntheticNode, isContainerSyntheticNode, isCreatedFromComponent, isComponentInstance, isComponent } from "../../../../../../../../paperclip";
import { compose, pure, withHandlers } from "recompose"
import { createTreeLayerComponents, TreeNodeLayerOuterProps } from "../../../../../../layers";
import { getAttribute, EMPTY_ARRAY, getNestedTreeNodeById, TreeNode, TreeMoveOffset } from "../../../../../../../../common";
import { Dispatch } from "redux";
import { pcLayerClick, pcLayerMouseOut, pcEditLayerLabelBlur, pcLayerMouseOver, pcLayerLabelChanged, pcLayerDoubleClick, pcLayerExpandToggleClick, pcLayerDroppedNode, RESIZER_STOPPED_MOVING } from "../../../../../../../actions";
import { StructReference } from "../../../../../../../../common";

const DRAG_TYPE = "SYNTHETIC_NODE";

type PCLayerOuterProps ={
  inComponentInstance?: boolean;
} & TreeNodeLayerOuterProps;

const isMovableNode = (node) => !isCreatedFromComponent(node) || isComponentInstance(node);

const {TreeNodeLayerComponent} = createTreeLayerComponents<PCLayerOuterProps>({
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
  canDrop(child: TreeNode, near: TreeNode, offset: number, root: TreeNode) {
    if (offset === TreeMoveOffset.APPEND) {
      if (!isComponent(child) && (!isCreatedFromComponent(near) || isContainerSyntheticNode(near))) {
        return true;
      }
    }

    // sibling
    return !isCreatedFromComponent(near);
  },
  canDrag: isMovableNode,
  dragType: DRAG_TYPE,
  getLabelProps: (attribs, props: any) => ({
    ...attribs,
    className: cx(attribs.className, {
      "in-component-instance": Boolean(getAttribute(props.node, EditorAttributeNames.CREATED_FROM_COMPONENT, EDITOR_NAMESPACE)) || Boolean(getAttribute(props.node, EditorAttributeNames.IS_COMPONENT_INSTANCE, EDITOR_NAMESPACE)),
      "is-component-root": props.isComponentRoot,
      "is-slot-container": Boolean(getAttribute(props.node, PCSourceAttributeNames.CONTAINER))
    })
  }),
  layerRenderer: (Base) => (props: PCLayerOuterProps) => {
    return <Base {...props} isComponentRoot={getAttribute(props.node, EditorAttributeNames.IS_COMPONENT_ROOT, EDITOR_NAMESPACE)} />;
  }
});

type SyntheticWindowLayersOuterProps = {
  hoveringNodeIds: string[];
  selectedReferences: string[];
  dispatch: Dispatch<any>;
  window: SyntheticWindow;
  browser: SyntheticBrowser;
};

type SyntheticWindowLayersInnerProps = {

} & SyntheticWindowLayersOuterProps;

const BaseSyntheticWindowLayersComponent = ({ hoveringNodeIds, selectedReferences, dispatch, window, browser }: SyntheticWindowLayersInnerProps) => {
  if(!window) {
    return null;
  }
  return <div className="m-synthetic-window-layers">
    {
      (window.documents || EMPTY_ARRAY).map(document => {
        return <TreeNodeLayerComponent key={document.id} node={document.root} depth={0} hoveringNodeIds={hoveringNodeIds} selectedNodeIds={selectedReferences} dispatch={dispatch} />
      })
    }
  </div>;
};

export const SyntheticWindowLayersComponent = compose<SyntheticWindowLayersInnerProps, SyntheticWindowLayersOuterProps>(
  pure
)(BaseSyntheticWindowLayersComponent);