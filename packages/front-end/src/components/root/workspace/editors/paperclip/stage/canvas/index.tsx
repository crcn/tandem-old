import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { compose, pure, withState, withHandlers } from "recompose";
import {
  EditorWindow,
  ToolType,
  REGISTERED_COMPONENT,
  RegisteredComponent,
  getOpenFile,
  OpenFile
} from "../../../../../../../state";
import {
  Dependency,
  getFramesByDependencyUri,
  Frame,
  SyntheticDocument,
  DependencyGraph
} from "paperclip";
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
  canvasMouseDoubleClicked,
  pcLayerRightClicked,
  canvasRightClicked
} from "../../../../../../../actions";
import { DropTarget, DropTargetMonitor } from "react-dnd";
import { InspectorNode } from "paperclip";

export type CanvasOuterProps = {
  frames: Frame[];
  toolType: ToolType;
  documents: SyntheticDocument[];
  sourceNodeInspector: InspectorNode;
  openFiles: OpenFile[];
  hoveringInspectorNodeIds: string[];
  selectedSyntheticNodeIds: string[];
  hoveringSyntheticNodeIds: string[];
  graph: DependencyGraph;
  activeFilePath: string;
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
  onContextMenu: (event: React.MouseEvent<any>) => any;
  onDragExit: (event: React.SyntheticEvent<any>) => any;
  setCanvasOuter: (element: HTMLElement) => any;
  onMouseDoubleClick: (event: any) => any;
} & CanvasOuterProps;

const BaseCanvasComponent = ({
  frames,
  documents,
  graph,
  dispatch,
  dependency,
  openFiles,
  toolType,
  setCanvasOuter,
  editorWindow,
  setCanvasContainer,
  onWheel,
  onDrop,
  hoveringInspectorNodeIds,
  selectedSyntheticNodeIds,
  hoveringSyntheticNodeIds,
  onMouseEvent,
  onDragOver,
  onMouseDoubleClick,
  onContextMenu,
  onMouseClick,
  sourceNodeInspector,
  connectDropTarget,
  onDragExit
}: CanvasInnerProps) => {
  const activeFrames = getFramesByDependencyUri(
    editorWindow.activeFilePath,
    frames,
    documents,
    graph
  );

  const canvas = getOpenFile(editorWindow.activeFilePath, openFiles).canvas;
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
        translateMousePositions={true}
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
            onContextMenu={onContextMenu}
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
                  willChange: `transform`,
                  WebkitFontSmoothing: `subpixel-antialiased`,
                  backfaceVisibility: `hidden`,
                  transform: `translate(${translate.left}px, ${
                    translate.top
                  }px) scale(${translate.zoom})`,
                  transformOrigin: "top left"
                } as any}
              >
                <PreviewLayerComponent
                  frames={activeFrames}
                  dependency={dependency}
                  documents={documents}
                />
                <ToolsLayerComponent
                  toolType={toolType}
                  openFiles={openFiles}
                  sourceNodeInspector={sourceNodeInspector}
                  selectedSyntheticNodeIds={selectedSyntheticNodeIds}
                  hoveringSyntheticNodeIds={hoveringSyntheticNodeIds}
                  hoveringInspectorNodeIds={hoveringInspectorNodeIds}
                  documents={documents}
                  graph={graph}
                  frames={frames}
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
  withHandlers(() => {

    // throttle to prevent jankiness
    const onWheel = (event, dispatch, canvasOuter) => {
      requestAnimationFrame(() => {
        const rect = canvasOuter.getBoundingClientRect();
        dispatch(canvasWheel(rect.width, rect.height, event));
      });
    };

    return {
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
      onContextMenu: ({ dispatch}) => (event: React.MouseEvent<any>) => {
        dispatch(canvasRightClicked(event));
      },
      setCanvasContainer: ({ dispatch, editorWindow }) => (
        element: HTMLDivElement
      ) => {
        dispatch(canvasContainerMounted(element, editorWindow.activeFilePath));
      },
      onWheel: ({ dispatch, canvasOuter }: CanvasInnerProps) => (
        event: React.WheelEvent<any>
      ) => {
        event.persist();
        event.preventDefault();
        event.stopPropagation();
        onWheel(event, dispatch, canvasOuter);
      }
    };
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
      canDrop: () => {
        return true;
      },
      drop: (
        { dispatch, editorWindow }: CanvasOuterProps,
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
