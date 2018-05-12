import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { SyntheticWindow, SyntheticBrowser, SyntheticNode, SyntheticDocument, SyntheticObjectType, EDITOR_NAMESPACE } from "../../../../../../../../paperclip";
import { compose, pure, withHandlers } from "recompose"
import { getAttribute, EMPTY_ARRAY } from "../../../../../../../../common";
import { Dispatch } from "redux";
import { pcLayerClick, pcLayerMouseOut, pcLayerMouseOver, pcLayerExpandToggleClick, pcLayerDroppedNode } from "../../../../../../../actions";
import { StructReference } from "../../../../../../../../common";
import {
  DropTarget,
  DragSource,
	DropTargetCollector,
} from "react-dnd";

const DRAG_TYPE = "SYNTHETIC_NODE";

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

const collect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: !!monitor.isOver(),
		canDrop: !!monitor.canDrop(),
  }
};


const labelTarget = {
	canDrop(node: SyntheticNode) {
		return true;
	},

	drop(props: SyntheticNode) {

	},
}

const BaseSyntheticNodeLayerLabelComponent = ({ connectDropTarget, connectDragSource, node, isOver, depth, expanded, selected, hovering, onLabelClick, onLabelMouseOut, onLabelMouseOver, onExpandToggleButtonClick }: SyntheticNodeLayerLabelInnerProps) => {
  const labelStyle = {
    paddingLeft: 30 + depth * 8
  };
  return connectDropTarget(connectDragSource(<div style={labelStyle} className={cx("label", { selected, hovering: hovering || isOver })} onMouseOver={onLabelMouseOver} onMouseOut={onLabelMouseOut} onClick={onLabelClick}>
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
  DropTarget(DRAG_TYPE, {
    canDrop({ node }: SyntheticNodeLayerLabelOuterProps, monitor) {
      return node.id !== (monitor.getItem() as SyntheticNode).id;
    },
    drop({ node, dispatch }: SyntheticNodeLayerLabelOuterProps, monitor) {
      dispatch(pcLayerDroppedNode(monitor.getItem() as SyntheticNode, node.id));
    },
  }, (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }
  })
)(BaseSyntheticNodeLayerLabelComponent);

type SyntheticNodeLayerOuterProps = {
  node: SyntheticNode;
  depth: number;
  dispatch: Dispatch<any>;
  hoveringNodeIds: string[];
  selectedReferences: string[];
};

type SyntheticNodeLayerInnerProps = {
} & SyntheticNodeLayerOuterProps;

const BaseSyntheticNodeLayerComponent = ({ hoveringNodeIds, selectedReferences, node, depth, dispatch }: SyntheticNodeLayerInnerProps) => {

  const selected = selectedReferences.indexOf(node.id) !== -1;
  const hovering = hoveringNodeIds.indexOf(node.id) !== -1;
  const expanded = getAttribute(node, "expanded", EDITOR_NAMESPACE);

  return <div className="m-synthetic-node-layer">
    <SyntheticNodeLayerLabelComponent node={node} selected={selected} hovering={hovering} dispatch={dispatch} depth={depth} expanded={expanded} />
    <div className="children">
      {
        !node.children.length || expanded ? node.children.map(child => {
          return <SyntheticNodeLayerComponent hoveringNodeIds={hoveringNodeIds} selectedReferences={selectedReferences} key={child.id} node={child as SyntheticNode} depth={depth + 1} dispatch={dispatch} />
        }) : null
      }
    </div>
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
  return <SyntheticNodeLayerComponent node={document.root} depth={0} dispatch={dispatch} hoveringNodeIds={hoveringNodeIds} selectedReferences={selectedReferences} />
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