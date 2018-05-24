import "./document-overlay.scss";
const cx = require("classnames");
import * as React from "react";
import * as Hammer from "react-hammerjs";
// import { Workspace, AVAILABLE_COMPONENT, AvailableComponent, Artboard } from "front-end/state";
// import { Workspace, AVAILABLE_COMPONENT, AvailableComponent, Artboard } from "front-end/state";
import { wrapEventToDispatch } from "../../../../../../../utils";
import { RootState, Editor } from "../../../../../../../state";
import { difference } from "lodash";
import { mapValues, values } from "lodash";
import {
  SyntheticNode,
  SyntheticDocument,
  SyntheticWindow,
  getSyntheticWindowDependency,
  getSyntheticWindow
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
} from "../../../../../../../actions";

export type VisualToolsProps = {
  editor: Editor;
  zoom: number;
  root: RootState;
  dispatch: Dispatch<any>;
};

type ArtboardOverlayToolsOuterProps = {
  dispatch: Dispatch<any>;
  document: SyntheticDocument;
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

const getDocumentRelativeBounds = memoize((document: SyntheticDocument) => ({
  left: 0,
  top: 0,
  right: document.bounds.right - document.bounds.left,
  bottom: document.bounds.bottom - document.bounds.top
}));

const ArtboardOverlayToolsBase = ({
  dispatch,
  document,
  hoveringNodeIds,
  zoom,
  onPanStart,
  onPan,
  onPanEnd
}: ArtboardOverlayToolsInnerProps) => {
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
            canvasToolOverlayMouseDoubleClicked.bind(this, document.id)
          )}
        >
          {hoveringNodeIds.map(nodeId => (
            <NodeOverlay
              zoom={zoom}
              key={nodeId}
              bounds={
                document.id === nodeId
                  ? getDocumentRelativeBounds(document)
                  : document.computed[nodeId] &&
                    document.computed[nodeId].bounds
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
      document
    }: ArtboardOverlayToolsOuterProps) => event => {
      dispatch(canvasToolOverlayMousePanStart(document.id));
    },
    onPan: ({
      dispatch,
      document
    }: ArtboardOverlayToolsOuterProps) => event => {
      dispatch(
        canvasToolOverlayMousePanning(
          document.id,
          { left: event.center.x, top: event.center.y },
          event.deltaY,
          event.velocityY
        )
      );
    },
    onPanEnd: ({
      dispatch,
      document
    }: ArtboardOverlayToolsOuterProps) => event => {
      event.preventDefault();
      setImmediate(() => {
        dispatch(canvasToolOverlayMousePanEnd(document.id));
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

const getHoveringSyntheticNodes = memoize(
  (root: RootState, document: SyntheticDocument): string[] => {
    const allNodes = (document && getTreeNodeIdMap(document.root)) || {};
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
  const activeWindow = getSyntheticWindow(editor.activeFilePath, root.browser);
  if (!activeWindow) {
    return null;
  }
  const dependency = getSyntheticWindowDependency(
    activeWindow,
    root.browser.graph
  );
  return (
    <div className="visual-tools-layer-component">
      {activeWindow.documents &&
        activeWindow.documents.map((document, i) => {
          return (
            <ArtboardOverlayTools
              key={document.id}
              document={document}
              hoveringNodeIds={getHoveringSyntheticNodes(root, document)}
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
