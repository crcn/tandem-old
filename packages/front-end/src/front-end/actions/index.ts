import { Action } from "redux";
import * as React from "react";
import { Directory, Point, Bounds, Struct, StructReference, TreeNode } from "../../common";
import { publicActionCreator } from "tandem-common";
import { SyntheticWindow, Dependency, DependencyGraph, ComputedDisplayInfo, SyntheticNativeNodeMap, SyntheticNode } from "../../paperclip";
import { TreeNodeClip } from "..";

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
export const CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED = "CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED";
export const CANVAS_TOOL_WINDOW_KEY_DOWN = "CANVAS_TOOL_WINDOW_KEY_DOWN";
export const CANVAS_TOOL_ARTBOARD_TITLE_CLICKED = "CANVAS_TOOL_ARTBOARD_TITLE_CLICKED";
export const FILE_NAVIGATOR_ITEM_CLICKED = "FILE_NAVIGATOR_ITEM_CLICKED";
export const FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED = "FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED";
export const FILE_NAVIGATOR_NEW_FILE_CLICKED = "FILE_NAVIGATOR_NEW_FILE_CLICKED";
export const FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED = "FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED";
export const FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED = "FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED";
export const FILE_NAVIGATOR_NEW_FILE_ENTERED = "FILE_NAVIGATOR_NEW_FILE_ENTERED";
export const FILE_NAVIGATOR_DROPPED_ITEM = "FILE_NAVIGATOR_DROPPED_ITEM";
export const OPEN_FILE_ITEM_CLICKED = "OPEN_FILE_ITEM_CLICKED";
export const OPEN_FILE_ITEM_CLOSE_CLICKED = "OPEN_FILE_ITEM_CLOSE_CLICKED";
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
export const RESIZER_START_DRGG          = "RESIZER_START_DRGG";
export const SELECTOR_DOUBLE_CLICKED  = "SELECTOR_DOUBLE_CLICKED";
export const SHORTCUT_A_KEY_DOWN = "SHORTCUT_A_KEY_DOWN";
export const SHORTCUT_R_KEY_DOWN = "SHORTCUT_R_KEY_DOWN";
export const SHORTCUT_T_KEY_DOWN = "SHORTCUT_T_KEY_DOWN";
export const SHORTCUT_ESCAPE_KEY_DOWN = "SHORTCUT_ESCAPE_KEY_DOWN";
export const SHORTCUT_SAVE_KEY_DOWN = "SHORTCUT_SAVE_KEY_DOWN";
export const SHORTCUT_QUICK_SEARCH_KEY_DOWN = "SHORTCUT_QUICK_SEARCH_KEY_DOWN";
export const SHORTCUT_DELETE_KEY_DOWN = "SHORTCUT_DELETE_KEY_DOWN";
export const SHORTCUT_UNDO_KEY_DOWN = "SHORTCUT_UNDO_KEY_DOWN";
export const SHORTCUT_REDO_KEY_DOWN = "SHORTCUT_REDO_KEY_DOWN";
export const INSERT_TOOL_FINISHED = "INSERT_TOOL_FINISHED";
export const SYNTHETIC_NODES_PASTED = "SYNTHETIC_NODES_PASTED";
export const APP_LOADED = "APP_LOADED";
export const SAVED_FILE = "SAVED_FILE";
export const SAVED_ALL_FILES = "SAVED_ALL_FILES";
export const NEW_FILE_ENTERED = "NEW_FILE_ENTERED";
export const NEW_DIRECTORY_ENTERED = "NEW_DIRECTORY_ENTERED";
export const RAW_CSS_TEXT_CHANGED = "RAW_CSS_TEXT_CHANGED";
export const SLOT_TOGGLE_CLICK = "SLOT_TOGGLE_CLICK";
export const NATIVE_NODE_TYPE_CHANGED = "NATIVE_NODE_TYPE_CHANGED";
export const TEXT_VALUE_CHANGED = "TEXT_VALUE_CHANGED";
export const PC_LAYER_MOUSE_OVER = "PC_LAYER_MOUSE_OVER";
export const PC_LAYER_MOUSE_OUT = "PC_LAYER_MOUSE_OUT";
export const PC_LAYER_CLICK = "PC_LAYER_CLICK";
export const PC_LAYER_DOUBLE_CLICK = "PC_LAYER_DOUBLE_CLICK";
export const PC_LAYER_LABEL_CHANGED = "PC_LAYER_LABEL_CHANGED";
export const PC_LAYER_EXPAND_TOGGLE_CLICK = "PC_LAYER_EXPAND_TOGGLE_CLICK";
export const PC_LAYER_DROPPED_NODE = "PC_LAYER_DROPPED_NODE";
export const PC_LAYER_EDIT_LABEL_BLUR = "PC_LAYER_EDIT_LABEL_BLUR";
export const NEW_FILE_ADDED = "NEW_FILE_ADDED";
export const QUICK_SEARCH_ITEM_CLICKED = "QUICK_SEARCH_ITEM_CLICKED";
export const QUICK_SEARCH_BACKGROUND_CLICK = "QUICK_SEARCH_BACKGROUND_CLICK";
export const NEW_VARIANT_NAME_ENTERED = "NEW_VARIANT_NAME_ENTERED";
export const COMPONENT_VARIANT_REMOVED = "COMPONENT_VARIANT_REMOVED";
export const COMPONENT_VARIANT_NAME_CHANGED = "COMPONENT_VARIANT_NAME_CHANGED";
export const COMPONENT_VARIANT_NAME_CLICKED = "COMPONENT_VARIANT_NAME_CLICKED";
export const COMPONENT_VARIANT_NAME_DEFAULT_TOGGLE_CLICK = "COMPONENT_VARIANT_NAME_DEFAULT_TOGGLE_CLICK";

export type WrappedEvent<T> = {
  sourceEvent: T
} & Action;

export type ProjectLoaded = {
  uri: string;
} & Action;

export type DocumentRendered = {
  nativeMap: SyntheticNativeNodeMap;
  documentId: string;
  info: ComputedDisplayInfo;
} & Action;

export type DependencyEntryLoaded = {
  entry: Dependency;
  graph: DependencyGraph;
} & Action;

export type FileNavigatorItemClicked = {
  node: TreeNode;
} & Action;

export type OpenFilesItemClick = {
  uri: string;
} & Action;

export type RawCSSTextChanged = {
  value: string
} & Action;

export type ProjectDirectoryLoaded = {
  directory: Directory;
} & Action;

export type SyntheticWindowOpened = {
  window: SyntheticWindow
} & Action;

export type CanvasToolOverlayMousePanStart = {
  documentId: string;
} & Action;

export type CanvasToolOverlayMousePanning = {
  documentId: string;
  deltaY: number;
  velocityY: number;
  center: Point;
} & Action;

export type NewFileAdded = {
  directoryId: string;
  basename: string;
  fileType: string;
} & Action;

export type CanvasToolOverlayMousePanEnd = {
  documentId: string;
} & Action;

export type CanvasToolOverlayClicked = {
  documentId: string;
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

export type TreeLayerMouseOver = {
  type: string;
  node: TreeNode;
} & Action;

export type TreeLayerLabelChanged = {
  label: string;
  node: TreeNode;
} & Action;

export type TreeLayerDroppedNode = {
  node: TreeNode;
  targetNode: TreeNode;
  offset?: 0|-1|1;
} & Action;

export type TreeLayerClick = TreeLayerMouseOver & WrappedEvent<React.MouseEvent<any>>;
export type TreeLayerExpandToggleClick = TreeLayerMouseOver;
export type TreeLayerMouseOut = TreeLayerMouseOver;

export type CanvasMounted = {
  element: HTMLDivElement;
} & Action;

export type NewFileEntered = {
  basename: string;
} & Action;

export type CanvasToolWindowKeyDown = {
  documentId: string;
} & WrappedEvent<React.KeyboardEvent<any>>;

export type CanvasToolArtboardTitleClicked = {
  documentId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type SlotToggleClick = {
} & Action;

export type NativeNodeTypeChanged = {
  nativeType: string;
} & Action;

export type NewVariantNameEntered = {
  value: string;
} & Action;

export type ComponentVariantNameChanged = {
  oldName: string;
  newName:string;
} & Action;

export type ComponentVariantNameClicked = {
  name: string;
} & Action;

export type ComponentVariantRemoved = {
  name: string;
} & Action;

export type ComponentVariantNameDefaultToggleClick = {
  name: string;
  value: boolean;
} & Action;

export type TextValueChanged = {
  value: string;
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
} & ResizerPathMoved;

export type SelectorDoubleClicked = {
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type ShortcutKeyDown = {

};

export type QuickSearchItemClicked = {
  file: TreeNode;
} & Action;

export type SavedFile = {
  uri: string
} & Action;


export type SavedAllFiles = {
} & Action;

export type InsertToolFinished = {
  bounds: Bounds;
} & Action;

export type SyntheticNodesPasted = {
  clips: TreeNodeClip[];
} & Action;

export type FileNavigatorLabelClicked = {
  fileId: string;
} & Action;

export type FileNavigatorNewFileEntered = {
  basename: string;
} & Action;

export type FileNavigatorDroppedItem = {
  node: TreeNode;
  targetNode: TreeNode;
  offset: 0 | -1 | 1;
} & Action;

export const fileNavigatorDroppedItem = (node: TreeNode, targetNode: TreeNode, offset: 0 | -1 | 1): FileNavigatorDroppedItem => ({
  node,
  targetNode,
  offset,
  type: FILE_NAVIGATOR_DROPPED_ITEM
});

export const fileNavigatorItemClicked = (node: TreeNode): FileNavigatorItemClicked => ({
  node,
  type: FILE_NAVIGATOR_ITEM_CLICKED,
});

export const fileNavigatorToggleDirectoryClicked = (node: TreeNode): FileNavigatorItemClicked => ({
  node,
  type: FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED,
});

export const newFileAdded = (directoryId: string, basename: string, fileType: "directory" | "file"): NewFileAdded => ({
  directoryId,
  basename,
  fileType,
  type: NEW_FILE_ADDED
});

export const fileNavigatorNewFileClicked = (): Action => ({
  type: FILE_NAVIGATOR_NEW_FILE_CLICKED
});

export const fileNavigatorNewDirectoryClicked = (): Action => ({
  type: FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED
});

export const quickSearchItemClicked = (file: TreeNode): QuickSearchItemClicked => ({
  file,
  type: QUICK_SEARCH_ITEM_CLICKED
});

export const quickSearchBackgroundClick = (): Action => ({
  type: QUICK_SEARCH_BACKGROUND_CLICK
});

export const fileNavigatorNewFileEntered = (basename: string): FileNavigatorNewFileEntered => ({
  basename,
  type: FILE_NAVIGATOR_NEW_FILE_ENTERED
});

export const openFilesItemClick = (uri: string): OpenFilesItemClick => ({
  uri,
  type: OPEN_FILE_ITEM_CLICKED,
});

export const openFilesItemCloseClick = (uri: string): OpenFilesItemClick => ({
  uri,
  type: OPEN_FILE_ITEM_CLOSE_CLICKED,
});

export const fileNavigatorItemDoubleClicked = (node: TreeNode): FileNavigatorItemClicked => ({
  node,
  type: FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED,
});

export const pcLayerMouseOver = (node: TreeNode): TreeLayerMouseOver => ({
  node,
  type: PC_LAYER_MOUSE_OVER,
});

export const pcLayerDoubleClick = (node: TreeNode): TreeLayerMouseOver => ({
  node,
  type: PC_LAYER_DOUBLE_CLICK,
});

export const pcLayerLabelChanged = (label: string, node: TreeNode): TreeLayerLabelChanged => ({
  label,
  node,
  type: PC_LAYER_LABEL_CHANGED,
});

export const pcLayerMouseOut = (node: TreeNode): TreeLayerMouseOut => ({
  node,
  type: PC_LAYER_MOUSE_OUT,
});

export const pcEditLayerLabelBlur = (node: TreeNode): TreeLayerMouseOut => ({
  node,
  type: PC_LAYER_EDIT_LABEL_BLUR
});

export const pcLayerClick = (node: TreeNode, sourceEvent: React.MouseEvent<any>): TreeLayerClick => ({
  node,
  sourceEvent,
  type: PC_LAYER_CLICK,
});

export const newVariantNameEntered = (value: string): NewVariantNameEntered => ({
  value,
  type: NEW_VARIANT_NAME_ENTERED
});

export const componentComponentVariantNameChanged = (oldName: string, newName: string): ComponentVariantNameChanged => ({
  oldName,
  newName,
  type: COMPONENT_VARIANT_NAME_CHANGED
});

export const componentComponentVariantNameClicked = (name: string): ComponentVariantNameClicked => ({
  name,
  type: COMPONENT_VARIANT_NAME_CLICKED
});

export const componentVariantRemoved = (name: string): ComponentVariantRemoved => ({
  name,
  type: COMPONENT_VARIANT_REMOVED
});


export const componentVariantNameDefaultToggleClick = (name: string, value: boolean): ComponentVariantNameDefaultToggleClick => ({
  name,
  value,
  type: COMPONENT_VARIANT_NAME_DEFAULT_TOGGLE_CLICK
});

export const pcLayerExpandToggleClick = (node: TreeNode): TreeLayerExpandToggleClick => ({
  node,
  type: PC_LAYER_EXPAND_TOGGLE_CLICK,
});

export const pcLayerDroppedNode = (node: SyntheticNode, targetNode: TreeNode, offset?: 0|-1|1): TreeLayerDroppedNode => ({
  node,
  targetNode,
  offset,
  type: PC_LAYER_DROPPED_NODE
})

export const rawCssTextChanged = (value: string): RawCSSTextChanged => ({
  value,
  type: RAW_CSS_TEXT_CHANGED
});

export const slotToggleClick = (): SlotToggleClick => ({
  type: SLOT_TOGGLE_CLICK
});

export const nativeNodeTypeChange = (nativeType: string): NativeNodeTypeChanged => ({
  nativeType,
  type: NATIVE_NODE_TYPE_CHANGED
});

export const textValueChanged = (value: string): TextValueChanged => ({
  value,
  type: TEXT_VALUE_CHANGED
});

export const appLoaded = publicActionCreator(() => ({ type: APP_LOADED }));
export const dependencyEntryLoaded = (entry: Dependency, graph: DependencyGraph): DependencyEntryLoaded => ({
  entry,
  graph,
  type: DEPENDENCY_ENTRY_LOADED
});

export const newFileEntered = (basename: string): NewFileEntered => ({
  basename,
  type: NEW_FILE_ENTERED
});

export const newDirectoryEntered = (basename: string): NewFileEntered => ({
  basename,
  type: NEW_DIRECTORY_ENTERED
});

export const projectLoaded = (uri: string): ProjectLoaded => ({
  uri,
  type: PROJECT_LOADED
});

export const projectDirectoryLoaded = publicActionCreator((directory: Directory): ProjectDirectoryLoaded => ({
  directory,
  type: PROJECT_DIRECTORY_LOADED
}));

export const shortcutKeyDown = publicActionCreator((type: string): ShortcutKeyDown => ({
  type
}));

export const syntheticNodesPasted = (clips: TreeNodeClip[]): SyntheticNodesPasted => ({
  clips,
  type: SYNTHETIC_NODES_PASTED
});

export const documentRendered = (documentId: string, info: ComputedDisplayInfo, nativeMap: SyntheticNativeNodeMap): DocumentRendered => ({
  nativeMap,
  documentId,
  info,
  type: DOCUMENT_RENDERED
});

export const savedFile = (uri: string): SavedFile => ({
  uri,
  type: SAVED_FILE
});

export const savedAllFiles = (uri: string): SavedAllFiles => ({
  type: SAVED_ALL_FILES
});

export const syntheticWindowOpened = (window: SyntheticWindow): SyntheticWindowOpened => ({
  window,
  type: SYNTHETIC_WINDOW_OPENED
});

export const canvasToolOverlayMousePanStart = (documentId: string): CanvasToolOverlayMousePanStart => ({
  documentId,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PAN_START,
});

export const canvasToolOverlayMousePanning = (documentId: string, center: Point, deltaY: number, velocityY: number): CanvasToolOverlayMousePanning => ({
  documentId,
  center,
  deltaY,
  velocityY,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PANNING,
});

export const canvasToolOverlayMouseLeave = (sourceEvent: React.MouseEvent<any>): CanvasToolOverlayMouseMoved => ({
  type: CANVAS_TOOL_OVERLAY_MOUSE_LEAVE,
  sourceEvent
});

export const canvasToolOverlayMousePanEnd = (documentId: string): CanvasToolOverlayMousePanEnd => ({
  documentId,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PAN_END,
});

export const canvasToolOverlayMouseDoubleClicked = (documentId: string, sourceEvent: React.MouseEvent<any>): CanvasToolOverlayClicked => ({
  documentId,
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

export const insertToolFinished = (bounds: Bounds): InsertToolFinished => ({
  bounds,
  type: INSERT_TOOL_FINISHED
});

export const canvasToolWindowBackgroundClicked = (sourceEvent: React.KeyboardEvent<any>): WrappedEvent<React.KeyboardEvent<any>> => ({ type: CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED, sourceEvent });
export const canvasToolWindowKeyDown = (documentId: string, sourceEvent: React.KeyboardEvent<any>): CanvasToolWindowKeyDown => ({ type: CANVAS_TOOL_WINDOW_KEY_DOWN, documentId, sourceEvent });
export const canvasToolDocumentTitleClicked = (documentId: string, sourceEvent: React.MouseEvent<any>): CanvasToolArtboardTitleClicked => ({ type: CANVAS_TOOL_ARTBOARD_TITLE_CLICKED, documentId, sourceEvent });


export const resizerPathMoved = (anchor: Point, originalBounds: Bounds, newBounds: Bounds, sourceEvent: MouseEvent): ResizerPathMoved => ({
  type: RESIZER_PATH_MOUSE_MOVED,
  anchor,
  originalBounds,
  newBounds,
  sourceEvent,
});

export const resizerPathStoppedMoving = (anchor: Point, originalBounds: Bounds, newBounds: Bounds, sourceEvent: MouseEvent): ResizerPathMoved => ({
  type: RESIZER_PATH_MOUSE_STOPPED_MOVING,
  anchor,
  originalBounds,
  newBounds,
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

export const resizerStartDrag = (sourceEvent: React.MouseEvent<any>): ResizerMouseDown => ({
  sourceEvent,
  type: RESIZER_START_DRGG,
});

export const selectorDoubleClicked = (nodeId: string, sourceEvent: React.MouseEvent<any>): SelectorDoubleClicked => ({
  nodeId,
  type: SELECTOR_DOUBLE_CLICKED,
  sourceEvent
});


