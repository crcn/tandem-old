import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { SyntheticWindow, SyntheticBrowser, SyntheticNode, SyntheticDocument, SyntheticObjectType, EDITOR_NAMESPACE } from "../../../../../../../../paperclip";
import { compose, pure, withHandlers } from "recompose"
import { getAttribute, EMPTY_ARRAY } from "../../../../../../../../common";
import { Dispatch } from "redux";
import { pcLayerClick, pcLayerMouseOut, pcLayerMouseOver, pcLayerExpandToggleClick } from "../../../../../../../actions";
import { StructReference } from "../../../../../../../../common";
import {
	DropTarget,
	DropTargetCollector,
} from "react-dnd";

type SyntheticNodeLayerOuterProps = {
  node: SyntheticNode;
  depth: number;
  dispatch: Dispatch<any>;
  hoveringNodeIds: string[];
  selectedReferences: string[];
};


const collect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: !!monitor.isOver(),
		canDrop: !!monitor.canDrop(),
  }
};


type SyntheticNodeLayerInnerProps = {
  onLabelMouseOver: (event: React.MouseEvent<any>) => any;
  onLabelMouseOut: (event: React.MouseEvent<any>) => any;
  onLabelClick: (event: React.MouseEvent<any>) => any;
  onExpandToggleButtonClick: (event: React.MouseEvent<any>) => any;
} & SyntheticNodeLayerOuterProps;

const BaseSyntheticNodeLayerComponent = ({ onExpandToggleButtonClick, onLabelMouseOver, onLabelMouseOut, onLabelClick, hoveringNodeIds, selectedReferences, node, depth, dispatch }: SyntheticNodeLayerInnerProps) => {
  const labelStyle = {
    paddingLeft: 30 + depth * 8
  };

  const selected = ~selectedReferences.indexOf(node.id);
  const hovering = ~hoveringNodeIds.indexOf(node.id);
  const expanded = getAttribute(node, "expanded", EDITOR_NAMESPACE);

  return <div className="m-synthetic-node-layer">
    <div style={labelStyle} className={cx("label", { selected, hovering })} onMouseOver={onLabelMouseOver} onMouseOut={onLabelMouseOut} onClick={onLabelClick}>
      <span onClick={onExpandToggleButtonClick}>
        { node.children.length ? expanded ? <i className="ion-arrow-down-b" /> : <i className="ion-arrow-right-b" /> : null }
      </span>
      { getAttribute(node, "label", EDITOR_NAMESPACE) || "Untitled" }
    </div>
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
  })
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
  // const selected = selectedReferences.find(ref => ref.id === document.id);
  // const hovering = hoveringNodeIds.find(ref => ref.id === document.id);
  // const expanded = getAttribute(document.root, "expanded", EDITOR_NAMESPACE);
  return <SyntheticNodeLayerComponent node={document.root} depth={1} dispatch={dispatch} hoveringNodeIds={hoveringNodeIds} selectedReferences={selectedReferences} />
  // return <div className="m-synthetic-document-layer">
  //   <div className={cx("label", { selected, hovering })} onMouseOver={onLabelMouseOver} onMouseOut={onLabelMouseOut} onClick={onLabelClick}>
  //     <span onClick={onExpandToggleButtonClick}>
  //       { document.root.children.length ? expanded ? <i className="ion-arrow-down-b" /> : <i className="ion-arrow-right-b" /> : null }
  //     </span>
  //     Component
  //   </div>
  //   <div className="children">
  //     {
  //       !document.root.children.length || expanded ? document.root.children.map(child => {
  //         return <SyntheticNodeLayerComponent key={child.id} hoveringNodeIds={hoveringNodeIds} selectedReferences={selectedReferences} node={child as SyntheticNode} dispatch={dispatch} depth={1} />
  //       }) : null
  //     }
  //   </div>
  // </div>;
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