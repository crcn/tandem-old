import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { RootState } from "../../../../../../../state";
import {
  SyntheticWindow,
  PaperclipState,
  SyntheticNode,
  SyntheticDocument,
  SyntheticObjectType,
  EditorAttributeNames,
  getComponentInstanceSyntheticNode,
  isContainerSyntheticNode,
  isCreatedFromComponent,
  SyntheticElement
} from "paperclip";
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
  !isCreatedFromComponent(node) || node.attributes.editor.isComponentInstance;

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
          !child.attributes.editor.isComponentRoot &&
          (!isCreatedFromComponent(near) || isContainerSyntheticNode(near))
        ) {
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
        "in-component-instance":
          props.node.attributes.editor.isCreatedFromComponent ||
          props.node.attributes.editor.isComponentInstance,
        "is-component-root": props.isComponentRoot,
        "is-slot-container": Boolean(
          (props.node as SyntheticElement).attributes.core.container
        )
      })
    }),
    layerRenderer: Base => (props: PCLayerOuterProps) => {
      return (
        <Base
          {...props}
          isComponentRoot={props.node.attributes.editor.isComponentRoot}
        />
      );
    }
  }
);

type SyntheticWindowLayersOuterProps = {
  hoveringNodeIds: string[];
  selectedReferences: string[];
  dispatch: Dispatch<any>;
  window: SyntheticWindow;
  browser: PaperclipState;
};

type SyntheticWindowLayersInnerProps = {} & SyntheticWindowLayersOuterProps;

const BaseSyntheticWindowLayersComponent = ({
  hoveringNodeIds,
  selectedReferences,
  dispatch,
  window,
  browser
}: SyntheticWindowLayersInnerProps) => {
  if (!window) {
    return null;
  }
  return (
    <div className="m-synthetic-window-layers">
      {(window.documents || EMPTY_ARRAY).map(document => {
        return (
          <TreeNodeLayerComponent
            key={document.id}
            node={document.root}
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

export const SyntheticWindowLayersComponent = compose<
  SyntheticWindowLayersInnerProps,
  SyntheticWindowLayersOuterProps
>(pure)(BaseSyntheticWindowLayersComponent);
