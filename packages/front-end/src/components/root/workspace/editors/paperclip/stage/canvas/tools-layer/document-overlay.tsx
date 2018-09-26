import "./document-overlay.scss";
const cx = require("classnames");
import * as React from "react";
import Hammer from "react-hammerjs";
import { wrapEventToDispatch } from "../../../../../../../../utils";
import { EditorWindow } from "../../../../../../../../state";
import {
  Frame,
  getFramesByDependencyUri,
  SyntheticDocument,
  DependencyGraph
} from "paperclip";
import { Bounds, memoize, TreeNodeIdMap, StructReference } from "tandem-common";
// import { Dispatcher, Bounds, wrapEventToDispatch, weakMemo, StructReference } from "aerial-common2";
import { Dispatch } from "redux";
import {
  canvasToolOverlayMousePanStart,
  canvasToolOverlayMousePanning,
  canvasToolOverlayMousePanEnd,
  canvasToolOverlayMouseDoubleClicked
} from "../../../../../../../../actions";

export type VisualToolsProps = {
  editorWindow: EditorWindow;
  zoom: number;
  document: SyntheticDocument;
  hoveringSyntheticNodeIds: string[];
  selectedSyntheticNodeIds: string[];
  documents: SyntheticDocument[];
  frames: Frame[];
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
};

type ArtboardOverlayToolsOuterProps = {
  dispatch: Dispatch<any>;
  frame: Frame;
  zoom: number;
  hoveringSyntheticNodeIds: string[];
};

type NodeOverlayProps = {
  bounds: Bounds;
  zoom: number;
  dispatch: Dispatch<any>;
};

class NodeOverlay extends React.PureComponent<NodeOverlayProps> {
  render() {
    const { zoom, bounds, dispatch } = this.props;
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
  }
}

const getDocumentRelativeBounds = memoize((document: Frame) => ({
  left: 0,
  top: 0,
  right: document.bounds.right - document.bounds.left,
  bottom: document.bounds.bottom - document.bounds.top
}));

class ArtboardOverlayTools extends React.PureComponent<
  ArtboardOverlayToolsOuterProps
> {
  onPanStart = event => {
    this.props.dispatch(
      canvasToolOverlayMousePanStart(this.props.frame.syntheticContentNodeId)
    );
  };
  onPan = event => {
    this.props.dispatch(
      canvasToolOverlayMousePanning(
        this.props.frame.syntheticContentNodeId,
        { left: event.center.x, top: event.center.y },
        event.deltaY,
        event.velocityY
      )
    );
  };
  onPanEnd = event => {
    event.preventDefault();
    setImmediate(() => {
      this.props.dispatch(
        canvasToolOverlayMousePanEnd(this.props.frame.syntheticContentNodeId)
      );
    });
  };

  render() {
    const { dispatch, frame, hoveringSyntheticNodeIds, zoom } = this.props;

    const { onPanStart, onPan, onPanEnd } = this;
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
            style={
              { width: "100%", height: "100%", position: "absolute" } as any
            }
            onDoubleClick={wrapEventToDispatch(
              dispatch,
              canvasToolOverlayMouseDoubleClicked.bind(
                this,
                frame.syntheticContentNodeId
              )
            )}
          >
            {hoveringSyntheticNodeIds.map((nodeId, i) => (
              <NodeOverlay
                zoom={zoom}
                key={nodeId}
                bounds={
                  frame.syntheticContentNodeId === nodeId
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
  }
}

const getHoveringSyntheticVisibleNodes = memoize(
  (
    hoveringSyntheticNodeIds: string[],
    selectedSyntheticNodeIds: string[],
    frame: Frame
  ): string[] => {
    const selectionRefIds = selectedSyntheticNodeIds;
    return hoveringSyntheticNodeIds.filter(
      nodeId =>
        selectionRefIds.indexOf(nodeId) === -1 &&
        ((frame.computed && frame.computed[nodeId]) ||
          frame.syntheticContentNodeId === nodeId)
    );
  }
);

export class NodeOverlaysTool extends React.PureComponent<VisualToolsProps> {
  render() {
    const {
      frames,
      editorWindow,
      dispatch,
      documents,
      graph,
      hoveringSyntheticNodeIds,
      selectedSyntheticNodeIds,
      zoom
    } = this.props;
    const activeFrames = getFramesByDependencyUri(
      editorWindow.activeFilePath,
      frames,
      documents,
      graph
    );

    return (
      <div className="visual-tools-layer-component">
        {activeFrames.map((frame: Frame, i) => {
          return (
            <ArtboardOverlayTools
              key={frame.syntheticContentNodeId}
              frame={frame}
              hoveringSyntheticNodeIds={getHoveringSyntheticVisibleNodes(
                hoveringSyntheticNodeIds,
                selectedSyntheticNodeIds,
                frame
              )}
              dispatch={dispatch}
              zoom={zoom}
            />
          );
        })}
      </div>
    );
  }
}
