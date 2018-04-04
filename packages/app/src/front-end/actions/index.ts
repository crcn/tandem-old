import { Action } from "redux";
import { Directory, Point, Bounds, Struct } from "common";
import { SyntheticWindow, Dependency, DependencyGraph, ComputedDisplayInfo } from "paperclip";

export const PROJECT_LOADED = "PROJECT_LOADED";
export const ACTIVE_FILE_CHANGED = "ACTIVE_FILE_CHANGED";
export const SYNTHETIC_WINDOW_OPENED = "SYNTHETIC_WINDOW_OPENED";
export const PROJECT_DIRECTORY_LOADED = "PROJECT_DIRECTORY_LOADED";
export const DEPENDENCY_ENTRY_LOADED = "DEPENDENCY_ENTRY_LOADED";
export const DOCUMENT_RENDERED = "DOCUMENT_RENDERERED";

export const CANVAS_TOOL_OVERLAY_MOUSE_LEAVE = "CANVAS_TOOL_OVERLAY_MOUSE_LEAVE";
export const CANVAS_TOOL_OVERLAY_MOUSE_PAN_START = "CANVAS_TOOL_OVERLAY_MOUSE_PAN_START";
export const CANVAS_TOOL_OVERLAY_MOUSE_PANNING = "CANVAS_TOOL_OVERLAY_MOUSE_PANNING";
export const CANVAS_TOOL_OVERLAY_MOUSE_PAN_END = "CANVAS_TOOL_OVERLAY_MOUSE_PAN_END";
export const CANVAS_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED = "CANVAS_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED";
export const FILE_NAVIGATOR_ITEM_CLICKED = "FILE_NAVIGATOR_ITEM_CLICKED";
export const CANVAS_MOUNTED = "CANVAS_MOUNTED";
export const CANVAS_MOUSE_MOVED = "CANVAS_MOUSE_MOVED";
export const CANVAS_MOUSE_CLICKED = "CANVAS_MOUSE_CLICKED";
export const CANVAS_WHEEL = "CANVAS_WHEEL";
export const CANVAS_MOTION_RESTED = "CANVAS_MOTION_RESTED";
export const RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";
export const RESIZER_PATH_MOUSE_STOPPED_MOVING = "RESIZER_PATH_MOUSE_STOPPED_MOVING";
export const RESIZER_MOVED               = "RESIZER_MOVED";
export const RESIZER_STOPPED_MOVING      = "RESIZER_STOPPED_MOVING";
export const RESIZER_MOUSE_DOWN          = "RESIZER_MOUSE_DOWN";
export const SELECTOR_DOUBLE_CLICKED  = "SELECTOR_DOUBLE_CLICKED";

export type WrappedEvent<T> = {
  sourceEvent: T
} & Action;

export type ProjectLoaded = {
  uri: string;
} & Action;

export type DocumentRendered = {
  window: SyntheticWindow;
  documentIndex: number;
  info: ComputedDisplayInfo;
} & Action;

export type DependencyEntryLoaded = {
  entry: Dependency;
  graph: DependencyGraph;
} & Action;

export type FileNavigatorItemClicked = {
  path: number[];
} & Action;

export type ProjectDirectoryLoaded = {
  directory: Directory;
} & Action;

export type SyntheticWindowOpened = {
  window: SyntheticWindow
} & Action;

export type CanvasToolOverlayMousePanStart = {
  artboardId: string;
} & Action;


export type CanvasToolOverlayMousePanning = {
  artboardId: string;
  deltaY: number;
  velocityY: number;
  center: Point;
} & Action;

export type CanvasToolOverlayMousePanEnd = {
  artboardId: string;
} & Action;

export type CanvasToolOverlayClicked = {
  artboardId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type CanvasToolOverlayMouseMoved = {
} & WrappedEvent<React.MouseEvent<any>>;

export type CanvasWheel = {
  canvasWidth: number;
  canvasHeight: number;
  type: string;
  metaKey: boolean;
  ctrlKey: boolean;
  deltaX: number;
  deltaY: number;
} & Action;

export type CanvasMounted = {
  element: HTMLDivElement;
} & Action;

export type ResizerPathMoved = {
  originalBounds: Bounds;
  newBounds: Bounds;
  anchor: Point;
} & WrappedEvent<MouseEvent>;

export type ResizerMoved = {
  point: Point;
} & Action;

export type ResizerMouseDown = {
} & WrappedEvent<React.MouseEvent<any>>;

export type ResizerPathStoppedMoving = {
} & WrappedEvent<React.MouseEvent<any>>;

export type SelectorDoubleClicked = {
  item: Struct;
} & WrappedEvent<React.MouseEvent<any>>;

export const fileNavigatorItemClicked = (path: number[]): FileNavigatorItemClicked => ({
  path,
  type: FILE_NAVIGATOR_ITEM_CLICKED,
});

export const dependencyEntryLoaded = (entry: Dependency, graph: DependencyGraph): DependencyEntryLoaded => ({
  entry,
  graph,
  type: DEPENDENCY_ENTRY_LOADED
});

export const projectLoaded = (uri: string): ProjectLoaded => ({
  uri,
  type: PROJECT_LOADED
});

export const projectDirectoryLoaded = (directory: Directory): ProjectDirectoryLoaded => ({
  directory,
  type: PROJECT_DIRECTORY_LOADED
});

export const documentRendered = (documentIndex: number, info: ComputedDisplayInfo, window: SyntheticWindow): DocumentRendered => ({
  documentIndex,
  info,
  window,
  type: DOCUMENT_RENDERED
});

export const syntheticWindowOpened = (window: SyntheticWindow): SyntheticWindowOpened => ({
  window,
  type: SYNTHETIC_WINDOW_OPENED
});

export const canvasToolOverlayMousePanStart = (artboardId: string): CanvasToolOverlayMousePanStart => ({
  artboardId,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PAN_START,
});


export const canvasToolOverlayMousePanning = (artboardId: string, center: Point, deltaY: number, velocityY: number): CanvasToolOverlayMousePanning => ({
  artboardId,
  center,
  deltaY,
  velocityY,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PANNING,
});

export const canvasToolOverlayMouseLeave = (sourceEvent: React.MouseEvent<any>): CanvasToolOverlayMouseMoved => ({
  type: CANVAS_TOOL_OVERLAY_MOUSE_LEAVE,
  sourceEvent
});

export const canvasToolOverlayMousePanEnd = (artboardId: string): CanvasToolOverlayMousePanEnd => ({
  artboardId,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PAN_END,
});

export const canvasToolOverlayMouseDoubleClicked = (artboardId: string, sourceEvent: React.MouseEvent<any>): CanvasToolOverlayClicked => ({
  artboardId,
  type: CANVAS_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
  sourceEvent
});


export const canvasContainerMounted = (element: HTMLDivElement): CanvasMounted => ({
  element,
  type: CANVAS_MOUNTED,
})

export const canvasMouseMoved = (sourceEvent: React.MouseEvent<any>): WrappedEvent<React.MouseEvent<any>> => ({
  sourceEvent,
  type: CANVAS_MOUSE_MOVED,
});

export const canvasMouseClicked = (sourceEvent: React.MouseEvent<any>): WrappedEvent<React.MouseEvent<any>> => ({
  sourceEvent,
  type: CANVAS_MOUSE_CLICKED,
});


export const canvasWheel = (canvasWidth: number, canvasHeight: number, { metaKey, ctrlKey, deltaX, deltaY, clientX, clientY }: React.WheelEvent<any>): CanvasWheel => ({
  metaKey,
  canvasWidth,
  canvasHeight,
  ctrlKey,
  deltaX,
  deltaY,
  type: CANVAS_WHEEL,
});


export const canvasMotionRested = () => ({
  type: CANVAS_MOTION_RESTED
});


export const resizerPathMoved = (anchor: Point, originalBounds: Bounds, newBounds: Bounds, sourceEvent: MouseEvent): ResizerPathMoved => ({
  type: RESIZER_PATH_MOUSE_MOVED,
  anchor,
  originalBounds,
  newBounds,
  sourceEvent,
});

export const resizerPathStoppedMoving = (sourceEvent): ResizerPathStoppedMoving => ({
  type: RESIZER_PATH_MOUSE_STOPPED_MOVING,
  sourceEvent: {...sourceEvent}
});

export const resizerMoved = (point: Point): ResizerMoved => ({
  point,
  type: RESIZER_MOVED,
});

export const resizerStoppedMoving = (point: Point): ResizerMoved => ({
  point,
  type: RESIZER_STOPPED_MOVING,
});


export const resizerMouseDown = (sourceEvent: React.MouseEvent<any>): ResizerMouseDown => ({
  sourceEvent,
  type: RESIZER_MOUSE_DOWN,
});

export const selectorDoubleClicked = (item: Struct, sourceEvent: React.MouseEvent<any>): SelectorDoubleClicked => ({
  item,
  type: SELECTOR_DOUBLE_CLICKED,
  sourceEvent
});


