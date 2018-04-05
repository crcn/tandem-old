import "./document-overlay.scss";
const cx = require("classnames");
import * as React from "react";
import * as Hammer from "react-hammerjs";
// import { Workspace, AVAILABLE_COMPONENT, AvailableComponent, Artboard } from "front-end/state";
// import { Workspace, AVAILABLE_COMPONENT, AvailableComponent, Artboard } from "front-end/state";
import { wrapEventToDispatch } from "front-end/utils";
import { RootState, getActiveWindow } from "front-end/state";
import { difference } from "lodash";
import { mapValues, values } from "lodash";
import { SyntheticNode, SyntheticDocument, SyntheticWindow, getSyntheticNodeSourceNode, getSyntheticWindowDependency, getComponentInfo, Component } from "paperclip";
import { Bounds, memoize, getTreeNodeIdMap, TreeNodeIdMap, StructReference, EMPTY_OBJECT } from "common";
import { compose, pure, withHandlers } from "recompose";
// import { Dispatcher, Bounds, wrapEventToDispatch, weakMemo, StructReference } from "aerial-common2";
import { Dispatch } from "redux";
import {
  canvasToolOverlayMouseLeave,
  canvasToolOverlayMousePanStart,
  canvasToolOverlayMousePanning,
  canvasToolOverlayMousePanEnd,
  canvasToolOverlayMouseDoubleClicked,
} from "front-end/actions";

export type VisualToolsProps = {
  zoom: number;
  root: RootState;
  dispatch: Dispatch<any>;
};

type ArtboardOverlayToolsOuterProps = {
  dispatch: Dispatch<any>;
  document: SyntheticDocument;
  zoom: number;
  hoveringNodes: SyntheticNode[];
};

type ArtboardOverlayToolsInnerProps = {
  onPanStart(event: any);
  onPan(event: any);
  onPanEnd(event: any);
} & ArtboardOverlayToolsOuterProps;

type NodeOverlayProps = {
  artboardId: string;
  bounds: Bounds;
  zoom: number;
  hovering: boolean;
  node: SyntheticNode;
  dispatch: Dispatch<any>;
};

const NodeOverlayBase = ({ artboardId, zoom, bounds, node, dispatch, hovering }: NodeOverlayProps) => {

  if (!bounds) {
    return null;
  }

  const borderWidth = 2 / zoom;

  const style = {
    left: bounds.left,
    top: bounds.top,

    // round to ensure that the bounds match up with the selection bounds
    width: Math.ceil(bounds.right - bounds.left),
    height: Math.ceil(bounds.bottom - bounds.top),
    boxShadow: `inset 0 0 0 ${borderWidth}px #00B5FF`
  };

  return <div
  className={cx("visual-tools-node-overlay", { hovering: hovering })}
  style={style} />;
}

const NodeOverlay = pure(NodeOverlayBase as any) as typeof NodeOverlayBase;

const ArtboardOverlayToolsBase = ({ dispatch, document, hoveringNodes, zoom, onPanStart, onPan, onPanEnd }: ArtboardOverlayToolsInnerProps) => {

  if (!document.computed) {
    return null;
  }

  if (!document.bounds) {
    return null;
  }

  const bounds = document.bounds;

  // TODO - compute info based on content
  const style = {
    position: "absolute",
    left: bounds.left,
    top: bounds.top,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top
  };

  return <div style={style as any}>
    <Hammer onPanStart={onPanStart} onPan={onPan} onPanEnd={onPanEnd} direction="DIRECTION_ALL">
      <div
        style={{ width: "100%", height: "100%", position: "absolute" } as any}
        onDoubleClick={wrapEventToDispatch(dispatch, canvasToolOverlayMouseDoubleClicked.bind(this, document.id))}>
      {
        hoveringNodes.map((node) => <NodeOverlay
          artboardId={document.id}
          zoom={zoom}
          key={node.id}
          node={node}
          bounds={document.computed[node.id] && document.computed[node.id].bounds}
          dispatch={dispatch}
          hovering={true} />)
      }
    </div>
    </Hammer>
  </div>
};

const enhanceArtboardOverlayTools = compose<ArtboardOverlayToolsInnerProps, ArtboardOverlayToolsOuterProps>(
  pure,
  withHandlers({
    onPanStart: ({ dispatch, document }: ArtboardOverlayToolsOuterProps) => (event) => {
      dispatch(canvasToolOverlayMousePanStart(document.id));
    },
    onPan: ({ dispatch, document }: ArtboardOverlayToolsOuterProps) => (event) => {
      dispatch(canvasToolOverlayMousePanning(document.id, { left: event.center.x, top: event.center.y }, event.deltaY, event.velocityY));
    },
    onPanEnd: ({ dispatch, document }: ArtboardOverlayToolsOuterProps) => (event) => {
      event.preventDefault();
      setImmediate(() => {
        dispatch(canvasToolOverlayMousePanEnd(document.id));
      });
    }
  })
);

const ArtboardOverlayTools = enhanceArtboardOverlayTools(ArtboardOverlayToolsBase);

const getNodes = memoize((refs: StructReference<any>[], allNodes: TreeNodeIdMap) => {
  return refs.map(({type, id}) => allNodes[id]).filter((flattenedObject) => !!flattenedObject)
});

const getHoveringSyntheticNodes = memoize((root: RootState, document: SyntheticDocument): SyntheticNode[] => {
  const allNodes = document && getTreeNodeIdMap(document.root) || {};
  return difference(
    getNodes(root.hoveringReferences, allNodes),
    getNodes(root.selectionReferences, allNodes)
  ) as SyntheticNode[]
});

export const  NodeOverlaysToolBase = ({ root, dispatch, zoom }: VisualToolsProps) => {
  const activeWindow = getActiveWindow(root);
  if (!activeWindow) {
    return null;
  }
  const dependency = getSyntheticWindowDependency(activeWindow, root.browser.graph);
  return <div className="visual-tools-layer-component">
    {
      activeWindow.documents && activeWindow.documents.map((document, i) => {
        return <ArtboardOverlayTools key={document.id} document={document}  hoveringNodes={getHoveringSyntheticNodes(root, document)} dispatch={dispatch} zoom={zoom} />;
      })
    }
  </div>
}

export const  NodeOverlaysTool = pure(NodeOverlaysToolBase as any) as typeof  NodeOverlaysToolBase;