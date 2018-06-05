import "./document-overlay.scss";
const cx = require("classnames");
import * as React from "react";
import * as Hammer from "react-hammerjs";
// import { Workspace, AVAILABLE_COMPONENT, AvailableComponent, Artboard } from "front-end/state";
// import { Workspace, AVAILABLE_COMPONENT, AvailableComponent, Artboard } from "front-end/state";
import { wrapEventToDispatch } from "../../../../../../../../utils";
import { RootState, Editor } from "../../../../../../../../state";
import { difference } from "lodash";
import { mapValues, values } from "lodash";
import {
  SyntheticVisibleNode,
  Frame,
  getFramesByDependencyUri,
  getSyntheticNodeById
} from "paperclip";
import {
  Bounds,
  memoize,
  getTreeNodeIdMap,
  TreeNodeIdMap,
  StructReference,
  EMPTY_OBJECT,
  Bounded
} from "tandem-common";
import { compose, pure, withHandlers } from "recompose";
// import { Dispatcher, Bounds, wrapEventToDispatch, weakMemo, StructReference } from "aerial-common2";
import { Dispatch } from "redux";
import {
  canvasToolOverlayMouseLeave,
  canvasToolOverlayMousePanStart,
  canvasToolOverlayMousePanning,
  canvasToolOverlayMousePanEnd,
  canvasToolOverlayMouseDoubleClicked
} from "../../../../../../../../actions";

export type VisualToolsProps = {
  editor: Editor;
  zoom: number;
  root: RootState;
  dispatch: Dispatch<any>;
};

type ArtboardOverlayToolsOuterProps = {
  dispatch: Dispatch<any>;
  frame: Frame;
  zoom: number;
  hoveringNodeIds: string[];
};

type ArtboardOverlayToolsInnerProps = {
  onPanStart(event: any);
  onPan(event: any);
  onPanEnd(event: any);
} & ArtboardOverlayToolsOuterProps;

type NodeOverlayProps = {
  bounds: Bounds;
  zoom: number;
  dispatch: Dispatch<any>;
};

const NodeOverlayBase = ({ zoom, bounds, dispatch }: NodeOverlayProps) => {
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

  return (
    <div className={cx("visual-tools-node-overlay hovering")} style={style} />
  );
};

const NodeOverlay = pure(NodeOverlayBase as any) as typeof NodeOverlayBase;

const getDocumentRelativeBounds = memoize((document: Frame) => ({
  left: 0,
  top: 0,
  right: document.bounds.right - document.bounds.left,
  bottom: document.bounds.bottom - document.bounds.top
}));

const ArtboardOverlayToolsBase = ({
  dispatch,
  frame,
  hoveringNodeIds,
  zoom,
  onPanStart,
  onPan,
  onPanEnd
}: ArtboardOverlayToolsInnerProps) => {
  if (!frame.computed) {
    return null;
  }

  if (!frame.bounds) {
    return null;
  }

  const bounds = frame.bounds;

  // TODO - compute info based on content
  const style = {
    position: "absolute",
    left: bounds.left,
    top: bounds.top,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top
  };

  return (
    <div style={style as any}>
      <Hammer
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        direction="DIRECTION_ALL"
      >
        <div
          style={{ width: "100%", height: "100%", position: "absolute" } as any}
          onDoubleClick={wrapEventToDispatch(
            dispatch,
            canvasToolOverlayMouseDoubleClicked.bind(this, frame.contentNodeId)
          )}
        >
          {hoveringNodeIds.map(nodeId => (
            <NodeOverlay
              zoom={zoom}
              key={nodeId}
              bounds={
                frame.contentNodeId === nodeId
                  ? getDocumentRelativeBounds(frame)
                  : frame.computed[nodeId] && frame.computed[nodeId].bounds
              }
              dispatch={dispatch}
            />
          ))}
        </div>
      </Hammer>
    </div>
  );
};

const enhanceArtboardOverlayTools = compose<
  ArtboardOverlayToolsInnerProps,
  ArtboardOverlayToolsOuterProps
>(
  pure,
  withHandlers({
    onPanStart: ({
      dispatch,
      frame
    }: ArtboardOverlayToolsOuterProps) => event => {
      dispatch(canvasToolOverlayMousePanStart(frame.contentNodeId));
    },
    onPan: ({ dispatch, frame }: ArtboardOverlayToolsOuterProps) => event => {
      dispatch(
        canvasToolOverlayMousePanning(
          frame.contentNodeId,
          { left: event.center.x, top: event.center.y },
          event.deltaY,
          event.velocityY
        )
      );
    },
    onPanEnd: ({
      dispatch,
      frame
    }: ArtboardOverlayToolsOuterProps) => event => {
      event.preventDefault();
      setImmediate(() => {
        dispatch(canvasToolOverlayMousePanEnd(frame.contentNodeId));
      });
    }
  })
);

const ArtboardOverlayTools = enhanceArtboardOverlayTools(
  ArtboardOverlayToolsBase
);

const getNodes = memoize(
  (refs: StructReference<any>[], allNodes: TreeNodeIdMap) => {
    return refs
      .map(({ type, id }) => allNodes[id])
      .filter(flattenedObject => !!flattenedObject);
  }
);

const getHoveringSyntheticVisibleNodes = memoize(
  (root: RootState, frame: Frame): string[] => {
    const allNodes =
      (frame &&
        getTreeNodeIdMap(
          getSyntheticNodeById(frame.contentNodeId, root.documents)
        )) ||
      {};
    const selectionRefIds = root.selectedNodeIds;
    return root.hoveringNodeIds.filter(
      nodeId => selectionRefIds.indexOf(nodeId) === -1
    );
  }
);

export const NodeOverlaysToolBase = ({
  root,
  editor,
  dispatch,
  zoom
}: VisualToolsProps) => {
  const activeFrames = getFramesByDependencyUri(
    editor.activeFilePath,
    root.frames,
    root.documents,
    root.graph
  );

  return (
    <div className="visual-tools-layer-component">
      {activeFrames.map((frame, i) => {
        return (
          <ArtboardOverlayTools
            key={frame.contentNodeId}
            frame={frame}
            hoveringNodeIds={getHoveringSyntheticVisibleNodes(root, frame)}
            dispatch={dispatch}
            zoom={zoom}
          />
        );
      })}
    </div>
  );
};

export const NodeOverlaysTool = pure(
  NodeOverlaysToolBase as any
) as typeof NodeOverlaysToolBase;
