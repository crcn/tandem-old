import "./overlay.scss";
const cx = require("classnames");
import * as React from "react";
import * as Hammer from "react-hammerjs";
import { Workspace, AVAILABLE_COMPONENT, AvailableComponent, Artboard } from "front-end/state";
import { difference } from "lodash";
import { mapValues, values } from "lodash";
import { FlattenedObjects, flattenObjects, SlimBaseNode } from "slim-dom";
import { compose, pure, withHandlers } from "recompose";
import { Dispatcher, Bounds, wrapEventToDispatch, weakMemo, StructReference } from "aerial-common2";
import { 
  stageToolOverlayMouseLeave,
  stageToolOverlayMousePanStart,
  stageToolOverlayMousePanning,
  stageToolOverlayMousePanEnd,
  stageToolOverlayMouseDoubleClicked,
} from "front-end/actions";

export type VisualToolsProps = {
  zoom: number;
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type ArtboardOverlayToolsOuterProps = {
  dispatch: Dispatcher<any>;
  artboard: Artboard;
  zoom: number;
  hoveringNodes: SlimBaseNode[];
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
  node: SlimBaseNode;
  dispatch: Dispatcher<any>;
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

const ArtboardOverlayToolsBase = ({ dispatch, artboard, hoveringNodes, zoom, onPanStart, onPan, onPanEnd }: ArtboardOverlayToolsInnerProps) => {

  if (!artboard.computedDOMInfo) {
    return null;
  }

  const style = {
    position: "absolute",
    left: artboard.bounds.left,
    top: artboard.bounds.top,
    width: artboard.bounds.right - artboard.bounds.left,
    height: artboard.bounds.bottom - artboard.bounds.top
  };

  return <div style={style as any}>
    <Hammer onPanStart={onPanStart} onPan={onPan} onPanEnd={onPanEnd} direction="DIRECTION_ALL">
      <div 
        style={{ width: "100%", height: "100%", position: "absolute" } as any} 
        onDoubleClick={wrapEventToDispatch(dispatch, stageToolOverlayMouseDoubleClicked.bind(this, artboard.$id))}>
      {
        hoveringNodes.map((node) => <NodeOverlay 
          artboardId={artboard.$id} 
          zoom={zoom} 
          key={node.id} 
          node={node} 
          bounds={artboard.computedDOMInfo[node.id] && artboard.computedDOMInfo[node.id].bounds} 
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
    onPanStart: ({ dispatch, artboard }: ArtboardOverlayToolsOuterProps) => (event) => {
      dispatch(stageToolOverlayMousePanStart(artboard.$id));
    },
    onPan: ({ dispatch, artboard }: ArtboardOverlayToolsOuterProps) => (event) => {
      dispatch(stageToolOverlayMousePanning(artboard.$id, { left: event.center.x, top: event.center.y }, event.deltaY, event.velocityY));
    },
    onPanEnd: ({ dispatch, artboard }: ArtboardOverlayToolsOuterProps) => (event) => {
      event.preventDefault();
      setImmediate(() => {
        dispatch(stageToolOverlayMousePanEnd(artboard.$id));
      });
    }
  })
);

const ArtboardOverlayTools = enhanceArtboardOverlayTools(ArtboardOverlayToolsBase);

const getNodes = weakMemo((refs: StructReference[], allNodes: FlattenedObjects) => {
  return refs.map(([type, id]) => allNodes[id]).filter((flattenedObject) => !!flattenedObject).map(object => object.value as SlimBaseNode)
});

const getHoveringSyntheticNodes = weakMemo((workspace: Workspace, artboard: Artboard) => {
  const allNodes = artboard.document && flattenObjects(artboard.document) || {};
  return difference(
    getNodes(workspace.hoveringRefs, allNodes),
    getNodes(workspace.selectionRefs, allNodes)
  );
});

export const  NodeOverlaysToolBase = ({ workspace, dispatch, zoom }: VisualToolsProps) => {
  return <div className="visual-tools-layer-component">
    {
      workspace.artboards.map((artboard) => {
        return <ArtboardOverlayTools key={artboard.$id} hoveringNodes={getHoveringSyntheticNodes(workspace, artboard)} artboard={artboard} dispatch={dispatch} zoom={zoom} />;
      })
    }
  </div>
}

export const  NodeOverlaysTool = pure(NodeOverlaysToolBase as any) as typeof  NodeOverlaysToolBase;