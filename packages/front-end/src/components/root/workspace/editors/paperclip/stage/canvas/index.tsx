import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { compose, pure, withState, withHandlers } from "recompose";
import {
  RootState,
  EditorWindow,
  ToolType,
  REGISTERED_COMPONENT,
  RegisteredComponent,
  getOpenFile
} from "../../../../../../../state";
import { Dependency, getFramesByDependencyUri } from "paperclip";
import { PreviewLayerComponent } from "./preview-layer";
import { throttle } from "lodash";
import { ToolsLayerComponent } from "./tools-layer";
import { Isolate } from "../../../../../../isolated";
import {
  canvasWheel,
  canvasContainerMounted,
  canvasMouseMoved,
  canvasMouseClicked,
  canvasMotionRested,
  canvasDroppedItem,
  canvasDraggedOver,
  canvasMouseDoubleClicked
} from "../../../../../../../actions";
import { DropTarget, DropTargetMonitor } from "react-dnd";

export type CanvasOuterProps = {
  root: RootState;
  editorWindow: EditorWindow;
  dependency: Dependency<any>;
  dispatch: Dispatch<any>;
};

export type CanvasInnerProps = {
  canvasOuter: HTMLElement;
  connectDropTarget: any;
  onWheel: (event: React.SyntheticEvent<MouseEvent>) => any;
  shouldTransitionZoom: boolean;
  canvasContainer: HTMLElement;
  setCanvasContainer(element: HTMLElement);
  onMotionRest: () => any;
  onDrop: (event: React.SyntheticEvent<any>) => any;
  onMouseEvent: (event: React.SyntheticEvent<any>) => any;
  onMouseClick: (event: React.SyntheticEvent<any>) => any;
  onDragOver: (event: React.SyntheticEvent<any>) => any;
  onDragExit: (event: React.SyntheticEvent<any>) => any;
  setCanvasOuter: (element: HTMLElement) => any;
  onMouseDoubleClick: (event: any) => any;
} & CanvasOuterProps;

const onWheel = () => {};
const BaseCanvasComponent = ({
  root,
  dispatch,
  dependency,
  setCanvasOuter,
  editorWindow,
  setCanvasContainer,
  onWheel,
  onDrop,
  onMouseEvent,
  onDragOver,
  onMouseDoubleClick,
  onMouseClick,
  connectDropTarget,
  onDragExit
}: CanvasInnerProps) => {
  const activeFrames = getFramesByDependencyUri(
    editorWindow.activeFilePath,
    root.frames,
    root.documents,
    root.graph
  );

  const canvas = getOpenFile(editorWindow.activeFilePath, root).canvas;
  const translate = canvas.translate;

  return (
    <div className="m-canvas" ref={setCanvasContainer}>
      {/* isolate necessary here for bounding client rect information */}
      <Isolate
        inheritCSS
        ignoreInputEvents
        className="canvas-component-isolate"
        onWheel={onWheel}
        scrolling={false}
        translateMousePositions={false}
      >
        <span>
          <style>
            {`html, body {
                overflow: hidden;
              }`}
          </style>

          <div
            ref={setCanvasOuter}
            onMouseMove={onMouseEvent}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onMouseClick}
            onDoubleClick={onMouseDoubleClick}
            tabIndex={-1}
            onDragExit={onDragExit}
            className="canvas-inner"
          >
            {connectDropTarget(
              <div
                style={{
                  transform: `translate(${translate.left}px, ${
                    translate.top
                  }px) scale(${translate.zoom})`,
                  transformOrigin: "top left"
                }}
              >
                <PreviewLayerComponent
                  frames={activeFrames}
                  dependency={dependency}
                  documents={root.documents}
                />
                <ToolsLayerComponent
                  root={root}
                  dispatch={dispatch}
                  zoom={translate.zoom}
                  editorWindow={editorWindow}
                />
              </div>
            )}
          </div>
        </span>
      </Isolate>
    </div>
  );
};

const enhance = compose<CanvasInnerProps, CanvasOuterProps>(
  pure,
  withState("canvasOuter", "setCanvasOuter", null),
  withState("canvasContainer", "setCanvasContainer", null),
  withHandlers({
    onMouseEvent: ({ dispatch, editorWindow }) => (
      event: React.MouseEvent<any>
    ) => {
      dispatch(canvasMouseMoved(editorWindow, event));
    },
    onMotionRest: ({ dispatch }) => () => {
      dispatch(canvasMotionRested());
    },
    onMouseClick: ({ dispatch }) => (event: React.MouseEvent<any>) => {
      dispatch(canvasMouseClicked(event));
    },
    onMouseDoubleClick: ({ dispatch }) => (event: React.MouseEvent<any>) => {
      dispatch(canvasMouseDoubleClicked(event));
    },
    setCanvasContainer: ({ dispatch, editorWindow }) => (
      element: HTMLDivElement
    ) => {
      dispatch(canvasContainerMounted(element, editorWindow.activeFilePath));
    },
    onWheel: ({ root, dispatch, canvasOuter }: CanvasInnerProps) => (
      event: React.WheelEvent<any>
    ) => {
      const rect = canvasOuter.getBoundingClientRect();
      event.preventDefault();
      event.stopPropagation();
      dispatch(canvasWheel(rect.width, rect.height, event));
    }
  }),
  DropTarget(
    [REGISTERED_COMPONENT, "FILE", "INSPECTOR_NODE"],
    {
      hover: throttle(
        ({ dispatch }: CanvasOuterProps, monitor: DropTargetMonitor) => {
          if (!monitor.getClientOffset()) {
            return;
          }
          const { x, y } = monitor.getClientOffset();
          const item = monitor.getItem();
          dispatch(canvasDraggedOver(item, { left: x, top: y }));
        },
        100
      ),
      canDrop: ({ root }: CanvasOuterProps, monitor: DropTargetMonitor) => {
        return true;
      },
      drop: (
        { root, dispatch, editorWindow }: CanvasOuterProps,
        monitor: DropTargetMonitor
      ) => {
        const item = monitor.getItem() as RegisteredComponent;
        const offset = monitor.getClientOffset();
        const point = {
          left: offset.x,
          top: offset.y
        };

        dispatch(canvasDroppedItem(item, point, editorWindow.activeFilePath));
      }
    },
    (connect, monitor) => {
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      };
    }
  ),
  pure
);

export const CanvasComponent = enhance(BaseCanvasComponent);
