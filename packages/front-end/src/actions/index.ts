import { Action } from "redux";
import * as React from "react";
import {
  Directory,
  Point,
  Bounds,
  Struct,
  StructReference,
  TreeNode,
  File,
  TreeMoveOffset,
  FSItem,
  FSItemTagNames
} from "tandem-common";
import { publicActionCreator } from "tandem-common";
import {
  Dependency,
  DependencyGraph,
  ComputedDisplayInfo,
  SyntheticNativeNodeMap,
  SyntheticVisibleNode,
  PCNodeClip,
  Frame
} from "paperclip";
import { RegisteredComponent } from "..";
import { ClientOffset } from "react-dnd";

export const PROJECT_LOADED = "PROJECT_LOADED";
export const ACTIVE_FILE_CHANGED = "ACTIVE_FILE_CHANGED";
export const SYNTHETIC_WINDOW_OPENED = "SYNTHETIC_WINDOW_OPENED";
export const PROJECT_DIRECTORY_LOADED = "PROJECT_DIRECTORY_LOADED";
export const DOCUMENT_RENDERED = "DOCUMENT_RENDERERED";

export const CANVAS_TOOL_OVERLAY_MOUSE_LEAVE =
  "CANVAS_TOOL_OVERLAY_MOUSE_LEAVE";
export const CANVAS_TOOL_OVERLAY_MOUSE_PAN_START =
  "CANVAS_TOOL_OVERLAY_MOUSE_PAN_START";
export const CANVAS_TOOL_OVERLAY_MOUSE_PANNING =
  "CANVAS_TOOL_OVERLAY_MOUSE_PANNING";
export const CANVAS_TOOL_OVERLAY_MOUSE_PAN_END =
  "CANVAS_TOOL_OVERLAY_MOUSE_PAN_END";
export const CANVAS_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED =
  "CANVAS_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED";
export const CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED =
  "CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED";
export const CANVAS_TOOL_WINDOW_KEY_DOWN = "CANVAS_TOOL_WINDOW_KEY_DOWN";
export const CANVAS_TOOL_ARTBOARD_TITLE_CLICKED =
  "CANVAS_TOOL_ARTBOARD_TITLE_CLICKED";
export const FILE_NAVIGATOR_ITEM_CLICKED = "FILE_NAVIGATOR_ITEM_CLICKED";
export const FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED =
  "FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED";
export const FILE_NAVIGATOR_NEW_FILE_CLICKED =
  "FILE_NAVIGATOR_NEW_FILE_CLICKED";
export const FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED =
  "FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED";
export const FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED =
  "FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED";
export const FILE_NAVIGATOR_NEW_FILE_ENTERED =
  "FILE_NAVIGATOR_NEW_FILE_ENTERED";
export const FILE_NAVIGATOR_DROPPED_ITEM = "FILE_NAVIGATOR_DROPPED_ITEM";
export const EDITOR_TAB_CLICKED = "EDITOR_TAB_CLICKED";
export const OPEN_FILE_ITEM_CLICKED = "OPEN_FILE_ITEM_CLICKED";
export const OPEN_FILE_ITEM_CLOSE_CLICKED = "OPEN_FILE_ITEM_CLOSE_CLICKED";
export const CANVAS_MOUNTED = "CANVAS_MOUNTED";
export const CANVAS_MOUSE_MOVED = "CANVAS_MOUSE_MOVED";
export const CANVAS_DRAGGED_OVER = "CANVAS_DRAGGED_OVER";
export const CANVAS_MOUSE_CLICKED = "CANVAS_MOUSE_CLICKED";
export const CANVAS_WHEEL = "CANVAS_WHEEL";
export const CANVAS_MOTION_RESTED = "CANVAS_MOTION_RESTED";
export const CANVAS_DROPPED_ITEM = "CANVAS_DROPPED_ITEM";
export const RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";
export const RESIZER_PATH_MOUSE_STOPPED_MOVING =
  "RESIZER_PATH_MOUSE_STOPPED_MOVING";
export const RESIZER_MOVED = "RESIZER_MOVED";
export const RESIZER_STOPPED_MOVING = "RESIZER_STOPPED_MOVING";
export const RESIZER_MOUSE_DOWN = "RESIZER_MOUSE_DOWN";
export const RESIZER_START_DRGG = "RESIZER_START_DRGG";
export const SELECTOR_DOUBLE_CLICKED = "SELECTOR_DOUBLE_CLICKED";
export const SHORTCUT_ZOOM_IN_KEY_DOWN = "SHORTCUT_ZOOM_IN_KEY_DOWN";
export const SHORTCUT_ZOOM_OUT_KEY_DOWN = "SHORTCUT_ZOOM_OUT_KEY_DOWN";
export const SHORTCUT_ESCAPE_KEY_DOWN = "SHORTCUT_ESCAPE_KEY_DOWN";
export const SHORTCUT_SAVE_KEY_DOWN = "SHORTCUT_SAVE_KEY_DOWN";
export const SHORTCUT_QUICK_SEARCH_KEY_DOWN = "SHORTCUT_QUICK_SEARCH_KEY_DOWN";
export const SHORTCUT_DELETE_KEY_DOWN = "SHORTCUT_DELETE_KEY_DOWN";
export const SHORTCUT_UNDO_KEY_DOWN = "SHORTCUT_UNDO_KEY_DOWN";
export const SHORTCUT_REDO_KEY_DOWN = "SHORTCUT_REDO_KEY_DOWN";
export const SHORTCUT_R_KEY_DOWN = "SHORTCUT_R_KEY_DOWN";
export const SHORTCUT_T_KEY_DOWN = "SHORTCUT_T_KEY_DOWN";
export const SHORTCUT_CONVERT_TO_COMPONENT_KEY_DOWN =
  "SHORTCUT_CONVERT_TO_COMPONENT_KEY_DOWN";
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
export const COMPONENT_VARIANT_NAME_DEFAULT_TOGGLE_CLICK =
  "COMPONENT_VARIANT_NAME_DEFAULT_TOGGLE_CLICK";
export const ELEMENT_VARIANT_TOGGLED = "ELEMENT_VARIANT_TOGGLED";

export type WrappedEvent<T> = {
  sourceEvent: T;
} & Action;

export type ProjectLoaded = {
  uri: string;
} & Action;

export type DocumentRendered = {
  nativeMap: SyntheticNativeNodeMap;
  documentId: string;
  info: ComputedDisplayInfo;
} & Action;

export type FileNavigatorItemClicked = {
  node: FSItem;
} & Action;

export type OpenFilesItemClick = {
  uri: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type RawCSSTextChanged = {
  value: string;
} & Action;

export type ProjectDirectoryLoaded = {
  directory: Directory;
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
  uri: string;
  fileType: FSItemTagNames;
} & Action;

export type CanvasToolOverlayMousePanEnd = {
  documentId: string;
} & Action;

export type CanvasToolOverlayClicked = {
  documentId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type CanvasToolOverlayMouseMoved = {} & WrappedEvent<
  React.MouseEvent<any>
>;

export type ElementVariantToggled = {
  node: SyntheticVisibleNode;
  newVariants: string[];
} & Action;

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
  node: TreeNode<any>;
} & Action;

export type TreeLayerLabelChanged = {
  label: string;
  node: TreeNode<any>;
} & Action;

export type TreeLayerDroppedNode = {
  node: TreeNode<any>;
  targetNode: TreeNode<any>;
  offset?: 0 | -1 | 1;
} & Action;

export type TreeLayerClick = TreeLayerMouseOver &
  WrappedEvent<React.MouseEvent<any>>;
export type TreeLayerExpandToggleClick = TreeLayerMouseOver;
export type TreeLayerMouseOut = TreeLayerMouseOver;

export type CanvasMounted = {
  element: HTMLDivElement;
  fileUri: string;
} & Action;

export type NewFileEntered = {
  basename: string;
} & Action;

export type CanvasToolWindowKeyDown = {
  documentId: string;
} & WrappedEvent<React.KeyboardEvent<any>>;

export type CanvasToolArtboardTitleClicked = {
  frame: Frame;
} & WrappedEvent<React.MouseEvent<any>>;

export type SlotToggleClick = {} & Action;

export type NativeNodeTypeChanged = {
  nativeType: string;
} & Action;

export type NewVariantNameEntered = {
  value: string;
} & Action;

export type ComponentVariantNameChanged = {
  oldName: string;
  newName: string;
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

export type ResizerMouseDown = {} & WrappedEvent<React.MouseEvent<any>>;

export type ResizerPathStoppedMoving = {} & ResizerPathMoved;

export type SelectorDoubleClicked = {
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type ShortcutKeyDown = {};

export type QuickSearchItemClicked = {
  file: File;
} & Action;

export type SavedFile = {
  uri: string;
} & Action;

export type SavedAllFiles = {} & Action;

export type InsertToolFinished = {
  fileUri: string;
  point: Point;
} & Action;

export type SyntheticVisibleNodesPasted = {
  clips: PCNodeClip[];
} & Action;

export type FileNavigatorLabelClicked = {
  fileId: string;
} & Action;

export type FileNavigatorNewFileEntered = {
  basename: string;
} & Action;

export type FileNavigatorDroppedItem = {
  node: File;
  targetNode: FSItem;
  offset: TreeMoveOffset;
} & Action;

export type EditorTabClicked = {
  uri: string;
} & Action;

export type CanvasDroppedItem = {
  editorUri: string;
  item: RegisteredComponent | TreeNode<any>;
  point: Point;
} & Action;

export type CanvasDraggingOver = {
  item: any;
  offset: Point;
} & Action;

export const fileNavigatorDroppedItem = (
  node: File,
  targetNode: Directory,
  offset: 0 | -1 | 1
): FileNavigatorDroppedItem => ({
  node,
  targetNode,
  offset,
  type: FILE_NAVIGATOR_DROPPED_ITEM
});

export const editorTabClicked = (uri: string): EditorTabClicked => ({
  uri,
  type: EDITOR_TAB_CLICKED
});

export const fileNavigatorItemClicked = (
  node: FSItem
): FileNavigatorItemClicked => ({
  node,
  type: FILE_NAVIGATOR_ITEM_CLICKED
});

export const fileNavigatorToggleDirectoryClicked = (
  node: FSItem
): FileNavigatorItemClicked => ({
  node,
  type: FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED
});

export const newFileAdded = (
  uri: string,
  fileType: FSItemTagNames
): NewFileAdded => ({
  uri,
  fileType,
  type: NEW_FILE_ADDED
});

export const elementVariantToggled = (
  newVariants: string[],
  node: SyntheticVisibleNode
): ElementVariantToggled => ({
  newVariants,
  node,
  type: ELEMENT_VARIANT_TOGGLED
});

export const fileNavigatorNewFileClicked = (): Action => ({
  type: FILE_NAVIGATOR_NEW_FILE_CLICKED
});

export const fileNavigatorNewDirectoryClicked = (): Action => ({
  type: FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED
});

export const quickSearchItemClicked = (file: File): QuickSearchItemClicked => ({
  file,
  type: QUICK_SEARCH_ITEM_CLICKED
});

export const quickSearchBackgroundClick = (): Action => ({
  type: QUICK_SEARCH_BACKGROUND_CLICK
});

export const fileNavigatorNewFileEntered = (
  basename: string
): FileNavigatorNewFileEntered => ({
  basename,
  type: FILE_NAVIGATOR_NEW_FILE_ENTERED
});

export const openFilesItemClick = (
  uri: string,
  sourceEvent: React.MouseEvent<any>
): OpenFilesItemClick => ({
  uri,
  sourceEvent,
  type: OPEN_FILE_ITEM_CLICKED
});

export const openFilesItemCloseClick = (uri: string): OpenFilesItemClick => ({
  uri,
  sourceEvent: null,
  type: OPEN_FILE_ITEM_CLOSE_CLICKED
});

export const fileNavigatorItemDoubleClicked = (
  node: FSItem
): FileNavigatorItemClicked => ({
  node,
  type: FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED
});

export const pcLayerMouseOver = (node: TreeNode<any>): TreeLayerMouseOver => ({
  node,
  type: PC_LAYER_MOUSE_OVER
});

export const pcLayerDoubleClick = (
  node: TreeNode<any>
): TreeLayerMouseOver => ({
  node,
  type: PC_LAYER_DOUBLE_CLICK
});

export const pcLayerLabelChanged = (
  label: string,
  node: TreeNode<any>
): TreeLayerLabelChanged => ({
  label,
  node,
  type: PC_LAYER_LABEL_CHANGED
});

export const pcLayerMouseOut = (node: TreeNode<any>): TreeLayerMouseOut => ({
  node,
  type: PC_LAYER_MOUSE_OUT
});

export const pcEditLayerLabelBlur = (
  node: TreeNode<any>
): TreeLayerMouseOut => ({
  node,
  type: PC_LAYER_EDIT_LABEL_BLUR
});

export const pcLayerClick = (
  node: TreeNode<any>,
  sourceEvent: React.MouseEvent<any>
): TreeLayerClick => ({
  node,
  sourceEvent,
  type: PC_LAYER_CLICK
});

export const newVariantNameEntered = (
  value: string
): NewVariantNameEntered => ({
  value,
  type: NEW_VARIANT_NAME_ENTERED
});

export const componentComponentVariantNameChanged = (
  oldName: string,
  newName: string
): ComponentVariantNameChanged => ({
  oldName,
  newName,
  type: COMPONENT_VARIANT_NAME_CHANGED
});

export const componentComponentVariantNameClicked = (
  name: string
): ComponentVariantNameClicked => ({
  name,
  type: COMPONENT_VARIANT_NAME_CLICKED
});

export const componentVariantRemoved = (
  name: string
): ComponentVariantRemoved => ({
  name,
  type: COMPONENT_VARIANT_REMOVED
});

export const componentVariantNameDefaultToggleClick = (
  name: string,
  value: boolean
): ComponentVariantNameDefaultToggleClick => ({
  name,
  value,
  type: COMPONENT_VARIANT_NAME_DEFAULT_TOGGLE_CLICK
});

export const pcLayerExpandToggleClick = (
  node: TreeNode<any>
): TreeLayerExpandToggleClick => ({
  node,
  type: PC_LAYER_EXPAND_TOGGLE_CLICK
});

export const pcLayerDroppedNode = (
  node: SyntheticVisibleNode,
  targetNode: TreeNode<any>,
  offset?: 0 | -1 | 1
): TreeLayerDroppedNode => ({
  node,
  targetNode,
  offset,
  type: PC_LAYER_DROPPED_NODE
});

export const rawCssTextChanged = (value: string): RawCSSTextChanged => ({
  value,
  type: RAW_CSS_TEXT_CHANGED
});

export const slotToggleClick = (): SlotToggleClick => ({
  type: SLOT_TOGGLE_CLICK
});

export const nativeNodeTypeChange = (
  nativeType: string
): NativeNodeTypeChanged => ({
  nativeType,
  type: NATIVE_NODE_TYPE_CHANGED
});

export const textValueChanged = (value: string): TextValueChanged => ({
  value,
  type: TEXT_VALUE_CHANGED
});

export const appLoaded = publicActionCreator(() => ({ type: APP_LOADED }));

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

export const projectDirectoryLoaded = publicActionCreator(
  (directory: Directory): ProjectDirectoryLoaded => ({
    directory,
    type: PROJECT_DIRECTORY_LOADED
  })
);

export const shortcutKeyDown = publicActionCreator(
  (type: string): ShortcutKeyDown => ({
    type
  })
);

export const syntheticNodesPasted = (
  clips: PCNodeClip[]
): SyntheticVisibleNodesPasted => ({
  clips,
  type: SYNTHETIC_NODES_PASTED
});

export const documentRendered = (
  documentId: string,
  info: ComputedDisplayInfo,
  nativeMap: SyntheticNativeNodeMap
): DocumentRendered => ({
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

export const canvasToolOverlayMousePanStart = (
  documentId: string
): CanvasToolOverlayMousePanStart => ({
  documentId,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PAN_START
});

export const canvasToolOverlayMousePanning = (
  documentId: string,
  center: Point,
  deltaY: number,
  velocityY: number
): CanvasToolOverlayMousePanning => ({
  documentId,
  center,
  deltaY,
  velocityY,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PANNING
});

export const canvasToolOverlayMouseLeave = (
  sourceEvent: React.MouseEvent<any>
): CanvasToolOverlayMouseMoved => ({
  type: CANVAS_TOOL_OVERLAY_MOUSE_LEAVE,
  sourceEvent
});

export const canvasToolOverlayMousePanEnd = (
  documentId: string
): CanvasToolOverlayMousePanEnd => ({
  documentId,
  type: CANVAS_TOOL_OVERLAY_MOUSE_PAN_END
});

export const canvasToolOverlayMouseDoubleClicked = (
  documentId: string,
  sourceEvent: React.MouseEvent<any>
): CanvasToolOverlayClicked => ({
  documentId,
  type: CANVAS_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
  sourceEvent
});

export const canvasContainerMounted = (
  element: HTMLDivElement,
  fileUri: string
): CanvasMounted => ({
  element,
  fileUri,
  type: CANVAS_MOUNTED
});

export const canvasMouseMoved = (
  sourceEvent: React.MouseEvent<any>
): WrappedEvent<React.MouseEvent<any>> => ({
  sourceEvent,
  type: CANVAS_MOUSE_MOVED
});

export const canvasDraggedOver = (
  item: any,
  offset: Point
): CanvasDraggingOver => ({
  item,
  offset,
  type: CANVAS_DRAGGED_OVER
});

export const canvasMouseClicked = (
  sourceEvent: React.MouseEvent<any>
): WrappedEvent<React.MouseEvent<any>> => ({
  sourceEvent,
  type: CANVAS_MOUSE_CLICKED
});

export const canvasWheel = (
  canvasWidth: number,
  canvasHeight: number,
  { metaKey, ctrlKey, deltaX, deltaY, clientX, clientY }: React.WheelEvent<any>
): CanvasWheel => ({
  metaKey,
  canvasWidth,
  canvasHeight,
  ctrlKey,
  deltaX,
  deltaY,
  type: CANVAS_WHEEL
});

export const canvasDroppedItem = (
  item: RegisteredComponent,
  point: Point,
  editorUri: string
): CanvasDroppedItem => ({
  editorUri,
  item,
  point,
  type: CANVAS_DROPPED_ITEM
});

export const canvasMotionRested = () => ({
  type: CANVAS_MOTION_RESTED
});

export const insertToolFinished = (
  point: Point,
  fileUri: string
): InsertToolFinished => ({
  point,
  fileUri,
  type: INSERT_TOOL_FINISHED
});

export const canvasToolWindowBackgroundClicked = (
  sourceEvent: React.KeyboardEvent<any>
): WrappedEvent<React.KeyboardEvent<any>> => ({
  type: CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED,
  sourceEvent
});
export const canvasToolWindowKeyDown = (
  documentId: string,
  sourceEvent: React.KeyboardEvent<any>
): CanvasToolWindowKeyDown => ({
  type: CANVAS_TOOL_WINDOW_KEY_DOWN,
  documentId,
  sourceEvent
});
export const canvasToolDocumentTitleClicked = (
  frame: Frame,
  sourceEvent: React.MouseEvent<any>
): CanvasToolArtboardTitleClicked => ({
  type: CANVAS_TOOL_ARTBOARD_TITLE_CLICKED,
  frame,
  sourceEvent
});

export const resizerPathMoved = (
  anchor: Point,
  originalBounds: Bounds,
  newBounds: Bounds,
  sourceEvent: MouseEvent
): ResizerPathMoved => ({
  type: RESIZER_PATH_MOUSE_MOVED,
  anchor,
  originalBounds,
  newBounds,
  sourceEvent
});

export const resizerPathStoppedMoving = (
  anchor: Point,
  originalBounds: Bounds,
  newBounds: Bounds,
  sourceEvent: MouseEvent
): ResizerPathMoved => ({
  type: RESIZER_PATH_MOUSE_STOPPED_MOVING,
  anchor,
  originalBounds,
  newBounds,
  sourceEvent: { ...sourceEvent }
});

export const resizerMoved = (point: Point): ResizerMoved => ({
  point,
  type: RESIZER_MOVED
});

export const resizerStoppedMoving = (point: Point): ResizerMoved => ({
  point,
  type: RESIZER_STOPPED_MOVING
});

export const resizerMouseDown = (
  sourceEvent: React.MouseEvent<any>
): ResizerMouseDown => ({
  sourceEvent,
  type: RESIZER_MOUSE_DOWN
});

export const resizerStartDrag = (
  sourceEvent: React.MouseEvent<any>
): ResizerMouseDown => ({
  sourceEvent,
  type: RESIZER_START_DRGG
});

export const selectorDoubleClicked = (
  nodeId: string,
  sourceEvent: React.MouseEvent<any>
): SelectorDoubleClicked => ({
  nodeId,
  type: SELECTOR_DOUBLE_CLICKED,
  sourceEvent
});
