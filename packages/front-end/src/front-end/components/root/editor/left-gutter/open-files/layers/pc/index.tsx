import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { RootState } from "../../../../../../../state";
import { SyntheticWindow, SyntheticBrowser, SyntheticNode, SyntheticDocument, SyntheticObjectType, EDITOR_NAMESPACE } from "../../../../../../../../paperclip";
import { compose, pure, withHandlers } from "recompose"
import { getAttribute, EMPTY_ARRAY, getNestedTreeNodeById } from "../../../../../../../../common";
import { Dispatch } from "redux";
import { pcLayerClick, pcLayerMouseOut, pcLayerMouseOver, pcLayerExpandToggleClick, pcLayerDroppedNode, RESIZER_STOPPED_MOVING } from "../../../../../../../actions";
import { StructReference } from "../../../../../../../../common";
import {
  DropTarget,
  DragSource,
	DropTargetCollector,
} from "react-dnd";

const DRAG_TYPE = "SYNTHETIC_NODE";
const DEPTH_PADDING = 8;
const DEPTH_OFFSET = 30;

type InsertOuterProps = {
  depth: number;
  node: SyntheticNode;
  dispatch: Dispatch<any>;
};

type InsertInnerProps = {
  isOver: boolean;
  connectDropTarget: any;
} & InsertOuterProps;

const BaseInsertComponent = ({ depth, isOver: hovering, connectDropTarget }: InsertInnerProps) => {
  const style = {
    width: `calc(100% - ${DEPTH_OFFSET + depth * DEPTH_PADDING}px)`
  };
  return connectDropTarget(<div style={style} className={cx("insert-line", { hovering })}>
  </div>);
};

const withNodeDropTarget = (offset: 0 | -1 | 1) => DropTarget(DRAG_TYPE, {
  canDrop: ({ node }: { node: SyntheticNode, dispatch: Dispatch<any> }, monitor) => {
    const draggingNode = (monitor.getItem() as SyntheticNode);
    return node.id !== draggingNode.id && getNestedTreeNodeById(node.id, draggingNode) == null;
  },
  drop: ({ dispatch, node }, monitor) => {
    dispatch(pcLayerDroppedNode(monitor.getItem() as SyntheticNode, node.id, offset));
  }
}, (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: !!monitor.isOver(),
    canDrop: !!monitor.canDrop(),
  }
});

const InsertBeforeComponent = compose<InsertInnerProps, InsertOuterProps>(
  pure,
  withNodeDropTarget(-1),
)(BaseInsertComponent);

const InsertAfterComponent = compose<InsertInnerProps, InsertOuterProps>(
  pure,
  withNodeDropTarget(1),
)(BaseInsertComponent);


type SyntheticNodeLayerLabelOuterProps = {
  node: SyntheticNode;
  depth: number;
  selected: boolean;
  hovering: boolean;
  expanded: boolean;
  dispatch: Dispatch<any>;
};

type SyntheticNodeLayerLabelInnerProps = {
  connectDropTarget?: any;
  connectDragSource?: any;
  isOver: boolean;
  canDrop: boolean;
  onLabelMouseOver: (event: React.MouseEvent<any>) => any;
  onLabelMouseOut: (event: React.MouseEvent<any>) => any;
  onLabelClick: (event: React.MouseEvent<any>) => any;
  onExpandToggleButtonClick: (event: React.MouseEvent<any>) => any;
} & SyntheticNodeLayerLabelOuterProps;

const BaseSyntheticNodeLayerLabelComponent = ({ connectDropTarget, connectDragSource, node, canDrop, isOver, depth, expanded, selected, hovering, onLabelClick, onLabelMouseOut, onLabelMouseOver, onExpandToggleButtonClick }: SyntheticNodeLayerLabelInnerProps) => {
  const labelStyle = {
    paddingLeft: DEPTH_OFFSET + depth * DEPTH_PADDING
  };
  return connectDropTarget(connectDragSource(<div style={labelStyle} className={cx("label", { selected, hovering: hovering || (isOver && canDrop) })} onMouseOver={onLabelMouseOver} onMouseOut={onLabelMouseOut} onClick={onLabelClick}>
    <span onClick={onExpandToggleButtonClick}>
      { node.children.length ? expanded ? <i className="ion-arrow-down-b" /> : <i className="ion-arrow-right-b" /> : null }
    </span>
    { getAttribute(node, "label", EDITOR_NAMESPACE) || "Untitled" }
  </div>));
};

const SyntheticNodeLayerLabelComponent = compose<SyntheticNodeLayerLabelInnerProps, SyntheticNodeLayerLabelOuterProps>(
  pure,
  withHandlers({
    onLabelMouseOver: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerMouseOver(node.id));
    },
    onLabelMouseOut: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerMouseOut(node.id));
    },
    onLabelClick: ({ dispatch, document, node }) => () => {
      dispatch(pcLayerClick(node.id));
    },
    onExpandToggleButtonClick: ({ dispatch, document, node }) => (event: React.MouseEvent<any>) => {
      dispatch(pcLayerExpandToggleClick(node.id));
      event.stopPropagation();
    }
  }),
  DragSource(DRAG_TYPE, {
    beginDrag({ node }: SyntheticNodeLayerLabelOuterProps) {
      return node;
    }
  }, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  })),
  withNodeDropTarget(0),
)(BaseSyntheticNodeLayerLabelComponent);

type SyntheticNodeLayerOuterProps = {
  isRoot?: boolean;
  node: SyntheticNode;
  depth: number;
  dispatch: Dispatch<any>;
  hoveringNodeIds: string[];
  selectedReferences: string[];
};

type SyntheticNodeLayerInnerProps = {
} & SyntheticNodeLayerOuterProps;

const BaseSyntheticNodeLayerComponent = ({ isRoot, hoveringNodeIds, selectedReferences, node, depth, dispatch }: SyntheticNodeLayerInnerProps) => {

  const selected = selectedReferences.indexOf(node.id) !== -1;
  const hovering = hoveringNodeIds.indexOf(node.id) !== -1;
  const expanded = getAttribute(node, "expanded", EDITOR_NAMESPACE);

  return <div className="m-synthetic-node-layer">
    { isRoot ? null : <InsertBeforeComponent node={node} depth={depth} dispatch={dispatch} /> }
    <SyntheticNodeLayerLabelComponent node={node} selected={selected} hovering={hovering} dispatch={dispatch} depth={depth} expanded={expanded} />
    <div className="children">
      {
        !node.children.length || expanded ? node.children.map(child => {
          return <SyntheticNodeLayerComponent hoveringNodeIds={hoveringNodeIds} selectedReferences={selectedReferences} key={child.id} node={child as SyntheticNode} depth={depth + 1} dispatch={dispatch} />
        }) : null
      }
    </div>
    { isRoot ? null : <InsertAfterComponent node={node} depth={depth} dispatch={dispatch}  /> }
  </div>;
};
const SyntheticNodeLayerComponent = compose<SyntheticNodeLayerInnerProps, SyntheticNodeLayerOuterProps>(
  pure
)(BaseSyntheticNodeLayerComponent);

type SyntheticDocumentLayerOuterProps = {
  hoveringNodeIds: string[];
  selectedReferences: string[];
  dispatch: Dispatch<any>;
  document: SyntheticDocument;
}

type SyntheticDocumentLayerInnerProps = {
} & SyntheticDocumentLayerOuterProps;

const BaseSyntheticDocumentLayerComponent = ({ dispatch, document, hoveringNodeIds, selectedReferences }: SyntheticDocumentLayerInnerProps) => {
  return <SyntheticNodeLayerComponent isRoot node={document.root} depth={0} dispatch={dispatch} hoveringNodeIds={hoveringNodeIds} selectedReferences={selectedReferences} />
};

const SyntheticDocumentLayerComponent = compose<SyntheticDocumentLayerInnerProps, SyntheticDocumentLayerOuterProps>(
  pure,
)(BaseSyntheticDocumentLayerComponent);

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
  return <div className="m-synthetic-window-layers">
    {
      (window.documents || EMPTY_ARRAY).map(document => {
        return <SyntheticDocumentLayerComponent hoveringNodeIds={hoveringNodeIds} selectedReferences={selectedReferences} document={document} dispatch={dispatch} />
      })
    }
  </div>;
};

export const SyntheticWindowLayersComponent = compose<SyntheticWindowLayersInnerProps, SyntheticWindowLayersOuterProps>(
  pure
)(BaseSyntheticWindowLayersComponent);