import { TreeNode, Bounds, Action, BaseEvent, Point, WrappedEvent, publicObject, Struct, StructReference } from "aerial-common2";
import { ApplicationState, AvailableComponent, Artboard } from "../state";
import { SlimParentNode, ComputedDOMInfo, DOMNodeMap, NativeObjectMap, SlimBaseNode, SlimCSSAtRule, SlimWindow, SlimCSSGroupingRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFontFace, SlimFragment } from "slim-dom";
import { Mutation } from "source-mutation";

export const RESIZER_MOVED               = "RESIZER_MOVED";
export const LOADED_SAVED_STATE          = "LOADED_SAVED_STATE";
export const TRIED_LOADING_APP_STATE    = "TRIED_LOADING_APP_STATE";
export const RESIZER_STOPPED_MOVING      = "RESIZER_STOPPED_MOVING";
export const RESIZER_MOUSE_DOWN          = "RESIZER_MOUSE_DOWN";
export const ARTBOARD_PANE_ROW_CLICKED     = "ARTBOARD_PANE_ROW_CLICKED";
export const PROMPTED_NEW_WINDOW_URL     = "PROMPTED_NEW_WINDOW_URL";
export const KEYBOARD_SHORTCUT_ADDED     = "KEYBOARD_SHORTCUT_ADDED";
export const DELETE_SHORCUT_PRESSED      = "DELETE_SHORCUT_PRESSED";
export const FULL_SCREEN_SHORTCUT_PRESSED = "FULL_SCREEN_SHORTCUT_PRESSED";
export const WINDOW_RESIZED = "WINDOW_RESIZED";
export const EMPTY_WINDOWS_URL_ADDED = "EMPTY_WINDOWS_URL_ADDED";
export const ZOOM_IN_SHORTCUT_PRESSED = "ZOOM_IN_SHORTCUT_PRESSED";
export const ZOOM_OUT_SHORTCUT_PRESSED = "ZOOM_OUT_SHORTCUT_PRESSED";
export const OPEN_NEW_WINDOW_SHORTCUT_PRESSED = "OPEN_NEW_WINDOW_SHORTCUT_PRESSED";
export const ARTBOARD_SELECTION_SHIFTED = "ARTBOARD_SELECTION_SHIFTED";
export const CLONE_WINDOW_SHORTCUT_PRESSED = "CLONE_WINDOW_SHORTCUT_PRESSED";
export const ESCAPE_SHORTCUT_PRESSED = "ESCAPE_SHORTCUT_PRESSED";
export const NEXT_ARTBOARD_SHORTCUT_PRESSED = "NEXT_ARTBOARD_SHORTCUT_PRESSED";
export const PREV_ARTBOARD_SHORTCUT_PRESSED = "PREV_ARTBOARD_SHORTCUT_PRESSED";
export const TOGGLE_TOOLS_SHORTCUT_PRESSED = "TOGGLE_TOOLS_SHORTCUT_PRESSED";
export const FULL_SCREEN_TARGET_DELETED = "FULL_SCREEN_TARGET_DELETED";
export const TOGGLE_TEXT_EDITOR_PRESSED  = "TOGGLE_TEXT_EDITOR_PRESSED";
export const TOGGLE_LEFT_GUTTER_PRESSED  = "TOGGLE_LEFT_GUTTER_PRESSED";
export const TOGGLE_RIGHT_GUTTER_PRESSED = "TOGGLE_RIGHT_GUTTER_PRESSED";
export const RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";
export const RESIZER_PATH_MOUSE_STOPPED_MOVING = "RESIZER_PATH_MOUSE_STOPPED_MOVING";
export const TEXT_EDITOR_CHANGED      = "TEXT_EDITOR_CHANGED";
export const CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED = "CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED";
export const CANVAS_MOTION_RESTED = "CANVAS_MOTION_RESTED";
export const TREE_NODE_LABEL_CLICKED = "TREE_NODE_LABE_CLICKED";
export const FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED   = "FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED";
export const FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
export const BANNER_CLOSED = "BANNER_CLOSED";
export const OPEN_ARTBOARDS_REQUESTED = "OPEN_ARTBOARDS_REQUESTED";
export const FILE_REMOVED = "FILE_REMOVED";
export const COMPONENT_SCREENSHOT_SAVED = "COMPONENT_SCREENSHOT_SAVED";
export const COMPONENTS_PANE_ADD_COMPONENT_CLICKED = "COMPONENTS_PANE_ADD_COMPONENT_CLICKED";
export const COMPONENTS_PANE_COMPONENT_CLICKED = "COMPONENTS_PANE_COMPONENT_CLICKED";
export const ARTBOARD_MOUNTED = "ARTBOARD_MOUNTED";
export const ARTBOARD_DOM_INFO_COMPUTED = "ARTBOARD_DOM_INFO_COMPUTED";
export const BREADCRUMB_ITEM_CLICKED   = "BREADCRUMB_ITEM_CLICKED";
export const BREADCRUMB_ITEM_MOUSE_ENTER   = "BREADCRUMB_ITEM_MOUSE_ENTER";
export const BREADCRUMB_ITEM_MOUSE_LEAVE   = "BREADCRUMB_ITEM_MOUSE_LEAVE";
export const FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED";
export const STAGE_MOUSE_MOVED = "STAGE_MOUSE_MOVED";
export const STAGE_MOUSE_CLICKED = "STAGE_MOUSE_CLICKED";
export const VISUAL_EDITOR_WHEEL = "VISUAL_EDITOR_WHEEL";
export const STAGE_TOOL_ARTBOARD_TITLE_CLICKED = "STAGE_TOOL_ARTBOARD_TITLE_CLICKED";
export const PREVIEW_DIFFED = "PREVIEW_DIFFED";
export const ARTBOARD_LOADED = "ARTBOARD_LOADED";
export const ARTBOARD_PATCHED = "ARTBOARD_PATCHED";
export const ARTBOARD_DOM_PATCHED = "ARTBOARD_DOM_PATCHED";
export const ARTBOARD_SCROLL = "ARTBOARD_SCROLL";
export const ARTBOARD_RENDERED = "ARTBOARD_RENDERED";
export const ARTBOARD_LOADING = "ARTBOARD_LOADING";
export const ARTBOARD_CREATED = "ARTBOARD_CREATED";
export const DOWN_KEY_DOWN = "DOWN_KEY_DOWN";
export const DOWN_KEY_UP = "DOWN_KEY_UP";
export const UP_KEY_DOWN = "UP_KEY_DOWN";
export const UP_KEY_UP = "UP_KEY_UP";
export const LEFT_KEY_DOWN = "LEFT_KEY_DOWN";
export const STAGE_RESIZED = "STAGE_RESIZED";
export const LEFT_KEY_UP = "LEFT_KEY_UP";
export const RIGHT_KEY_DOWN = "RIGHT_KEY_DOWN";
export const RIGHT_KEY_UP = "RIGHT_KEY_UP";
export const STAGE_TOOL_WINDOW_BACKGROUND_CLICKED = "STAGE_TOOL_WINDOW_BACKGROUND_CLICKED";
export const DISPLAY_SOURCE_CODE_REQUESTED = "DISPLAY_SOURCE_CODE_REQUESTED";
export const STAGE_TOOL_OVERLAY_MOUSE_LEAVE = "STAGE_TOOL_OVERLAY_MOUSE_LEAVE";
export const STAGE_TOOL_OVERLAY_MOUSE_PAN_START = "STAGE_TOOL_OVERLAY_MOUSE_PAN_START";
export const STAGE_TOOL_OVERLAY_MOUSE_PANNING = "STAGE_TOOL_OVERLAY_MOUSE_PANNING";
export const STAGE_TOOL_OVERLAY_MOUSE_PAN_END = "STAGE_TOOL_OVERLAY_MOUSE_PAN_END";
export const STAGE_TOOL_WINDOW_KEY_DOWN = "STAGE_TOOL_WINDOW_KEY_DOWN";
export const OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED = "OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED";
export const WORKSPACE_DELETION_SELECTED = "WORKSPACE_DELETION_SELECTED";
export const STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED = "STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED";
export const SELECTOR_DOUBLE_CLICKED = "SELECTOR_DOUBLE_CLICKED";
export const STAGE_TOOL_EDIT_TEXT_CHANGED = "STAGE_TOOL_EDIT_TEXT_CHANGED";
export const STAGE_TOOL_EDIT_TEXT_KEY_DOWN = "STAGE_TOOL_EDIT_TEXT_KEY_DOWN";
export const STAGE_TOOL_EDIT_TEXT_BLUR = "STAGE_TOOL_EDIT_TEXT_BLUR";
export const STAGE_MOUNTED = "STAGE_MOUNTED";
export const CSS_DECLARATION_NAME_CHANGED   = "CSS_DECLARATION_NAME_CHANGED";
export const CSS_DECLARATION_VALUE_CHANGED   = "CSS_DECLARATION_VALUE_CHANGED";
export const ARTBOARD_FOCUSED   = "ARTBOARD_FOCUSED";
export const CSS_DECLARATION_CREATED   = "CSS_DECLARATION_CREATED";
export const CSS_DECLARATION_TITLE_MOUSE_ENTER   = "CSS_DECLARATION_TITLE_MOUSE_ENTER";
export const SOURCE_CLICKED   = "SOURCE_CLICKED";
export const CSS_DECLARATION_TITLE_MOUSE_LEAVE   = "CSS_DECLARATION_TITLE_MOUSE_LEAVE";
export const TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED   = "TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED";
export const CSS_TOGGLE_DECLARATION_EYE_CLICKED   = "CSS_TOGGLE_DECLARATION_EYE_CLICKED";
export const API_COMPONENTS_LOADED = "API_COMPONENTS_LOADED";
export const DND_STARTED = "DND_STARTED";
export const DND_ENDED = "DND_ENDED";
export const DND_HANDLED = "DND_HANDLED";
export const EXCEPTION_CAUGHT = "EXCEPTION_CAUGHT";

/**
 * Types
 */

export type StageWheel = {
  workspaceId: string;
  canvasWidth: number;
  canvasHeight: number;
  type: string;
  metaKey: boolean;
  ctrlKey: boolean;
  deltaX: number;
  deltaY: number;
} & BaseEvent;

export type StageMounted = {
  element: HTMLDivElement;
} & BaseEvent;


export type ResizerMoved = {
  point: Point;
  workspaceId: string;
} & BaseEvent;

export type ResizerMouseDown = {
  workspaceId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type TreeNodeLabelClicked = {
  node: TreeNode<any>
} & BaseEvent;

export type ArtboardPaneRowClicked = {
  artboardId: string
} & WrappedEvent<React.MouseEvent<any>>;

export type BaseKeyboardEvent<T> = {
  sourceEvent?: T;
} & BaseEvent;

export type ArtboardInfo = {
  componentId: string;
  previewName: string;
  width: number;
  height: number;
};

export type PromptedNewWindowUrl = {
  workspaceId: string;
  location: string;
} & BaseEvent;

export type ShortcutEvent = {
  type: string
} & BaseKeyboardEvent<KeyboardEvent>;

export type ResizerPathMoved = {
  originalBounds: Bounds;
  newBounds: Bounds;
  anchor: Point;
  workspaceId: string;
} & WrappedEvent<MouseEvent>;

export type LoadedSavedState = {
  state: ApplicationState;
} & BaseEvent;

export type ArtboardFocused = {
  artboardId: string;
} & BaseEvent;

export type ExceptionCaught = {
  error: {
    message: string
  };
} & BaseEvent;

export type ResizerPathStoppedMoving = {
  workspaceId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageWillArtboardTitleClicked = {
  artboardId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type FileChanged = {
  filePath: string;
  publicPath: string;
} & BaseEvent;

export type StageWillWindowKeyDown = {
  artboardId: string;
} & WrappedEvent<React.KeyboardEvent<any>>;

export type OpenExternalWindowButtonClicked = {
  artboardId: string;
} & WrappedEvent<React.KeyboardEvent<any>>;

export type StageToolNodeOverlayClicked = {
  artboardId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolNodeOverlayHoverOver = {
  artboardId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolEditTextKeyDown = {
  nodeId: string;
} & WrappedEvent<React.KeyboardEvent<any>>;

export type StageToolEditTextChanged = {
  nodeId: string;
} & WrappedEvent<React.ChangeEvent<any>>;

export type StageToolEditTextBlur = {
  nodeId: string;
} & WrappedEvent<React.FocusEvent<any>>;

export type BreadcrumbItemClicked = {
  nodeId: string;
  artboardId: string;
} & BaseEvent;

export type OpenArtboardsRequested = {
  artboardInfo: ArtboardInfo[]
} & BaseEvent;

export type BreadcrumbItemMouseEnterLeave = {
  nodeId: string;
  artboardId: string;
} & BaseEvent;

export type StageToolNodeOverlayHoverOut = {
  artboardId: string;
  nodeId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolOverlayMousePanStart = {
  artboardId: string;
} & BaseEvent;

export type StageToolOverlayMousePanning = {
  artboardId: string;
  deltaY: number;
  velocityY: number;
  center: Point;
} & BaseEvent;

export type ArtboardSelectionShifted = {
  artboardId: string;
} & BaseEvent;

export type StageToolOverlayMousePanEnd = {
  artboardId: string;
} & BaseEvent;

export type StageToolOverlayClicked = {
  artboardId: string;
} & WrappedEvent<React.MouseEvent<any>>;

export type StageToolOverlayMouseMoved = {
} & WrappedEvent<React.MouseEvent<any>>;

export type ArtboardMounted = {
  artboardId: string;
} & BaseEvent;

export type ArtboardDOMInfoComputed = {
  artboardId: string;
  computedInfo: ComputedDOMInfo;
} & BaseEvent;

export type SelectorDoubleClicked = {
  item: Struct;
} & WrappedEvent<React.MouseEvent<any>>;

export type WorkspaceSelectionDeleted = {
  workspaceId: string;
} & BaseEvent;

export type FileRemoved = {
  filePath: string;
  publicPath: string;
} & BaseEvent;

export type DeleteShortcutPressed = ShortcutEvent;

export type EmptyWindowsUrlAdded = {
  url: string;
} & BaseEvent;

export type CSSDeclarationChanged = {
  index: number;
  artboardId: string;
  name: string;
  ownerId: string;
  value: string;
} & BaseEvent;

export type CSSDeclarationTitleMouseLeaveEnter = {
  artboardId: string;
  ruleId: string;
} & BaseEvent;

export type SourceClicked = {
  artboardId: string;
  itemId: string;
} & BaseEvent;

export type ArtboardLoaded = {
  artboardId: string;
  checksum: string;
  dependencyUris: string[];
  document: SlimParentNode;
  mount: HTMLIFrameElement;
} & BaseEvent;  

export type ArtboardPatched = {
  artboardId: string;
  checksum: string;
  nativeObjectMap: NativeObjectMap;
  document: SlimParentNode;
} & BaseEvent;  

export type ArtboardDOMPatched = {
  artboardId: string;
  nativeObjectMap: NativeObjectMap;
} & BaseEvent;  

export type PreviewDiffed = {
  componentId: string;
  previewName: string;
  documentChecksum: string;
  diff: Mutation<any[]>[];
} & BaseEvent;  

export type ArtboardRendered = {
  artboardId: string;
  nativeObjectMap: NativeObjectMap;
} & BaseEvent;  

export type ArtboardLoading = {
  artboardId: string;
} & BaseEvent;  

export type ArtboardMountLoaded = {
  
} & BaseEvent;

export type WindowResized = {
  width: number;
  height: number;
} & BaseEvent;

export type StageResized = WindowResized;

export type ArtboardCreated = {
  artboard: Artboard;
} & BaseEvent;  

export type ArtboardScroll = {
  artboardId: string;
  scrollPosition: Point;
} & BaseEvent;

export type ToggleCSSTargetSelectorClicked = {
  itemId: string;
  artboardId: string;
} & BaseEvent;

export type CSSToggleDeclarationEyeClicked = {
  index: number;
  artboardId: string;
  itemId: string;
  declarationName: string;
} & BaseEvent;

export type APIComponentsLoaded = {
  components: AvailableComponent[];
} & BaseEvent;

export type DNDEvent = {
  ref: StructReference;
} & WrappedEvent<React.DragEvent<any>>;

export type ComponentsPaneComponentClicked = {
  componentId: string;
  sourceEvent: MouseEvent;
} & BaseEvent;

export const componentsPaneAddComponentClicked = () => ({
  type: COMPONENTS_PANE_ADD_COMPONENT_CLICKED
});

export const componentsPaneComponentClicked = (componentId, sourceEvent): ComponentsPaneComponentClicked => ({
  type: COMPONENTS_PANE_COMPONENT_CLICKED,
  sourceEvent,
  componentId
});

export const canvasMotionRested = () => ({
  type: CANVAS_MOTION_RESTED
});

export const treeNodeLabelClicked = (node: TreeNode<any>): TreeNodeLabelClicked => ({ type: TREE_NODE_LABEL_CLICKED, node });
export const stageToolArtboardTitleClicked = (artboardId: string, sourceEvent: React.MouseEvent<any>): StageWillArtboardTitleClicked => ({ type: STAGE_TOOL_ARTBOARD_TITLE_CLICKED, artboardId, sourceEvent });
export const stageToolWindowKeyDown = (artboardId: string, sourceEvent: React.KeyboardEvent<any>): StageWillWindowKeyDown => ({ type: STAGE_TOOL_WINDOW_KEY_DOWN, artboardId, sourceEvent });
export const openExternalWindowButtonClicked = (artboardId: string, sourceEvent: React.KeyboardEvent<any>): OpenExternalWindowButtonClicked => ({ type: OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED, artboardId, sourceEvent });

export const stageToolWindowBackgroundClicked = (sourceEvent: React.KeyboardEvent<any>): WrappedEvent<React.KeyboardEvent<any>> => ({ type: STAGE_TOOL_WINDOW_BACKGROUND_CLICKED, sourceEvent });

// TODO - possible include CSS url, or artboardId
export const toggleCSSTargetSelectorClicked = (itemId: string, artboardId: string): ToggleCSSTargetSelectorClicked => ({
  type: TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED,
  artboardId,
  itemId,
});

export const cssToggleDeclarationEyeClicked = (artboardId: string, itemId: string, declarationName: string, index: number): CSSToggleDeclarationEyeClicked => ({
  index,
  type: CSS_TOGGLE_DECLARATION_EYE_CLICKED,
  artboardId,
  itemId,
  declarationName,
});


export const resizerMoved = (workspaceId: string, point: Point): ResizerMoved => ({
  workspaceId,
  point,
  type: RESIZER_MOVED,
});

export const bannerClosed = () => ({
  type: BANNER_CLOSED
});

export const dndStarted = (ref: StructReference, sourceEvent: React.DragEvent<any>): DNDEvent => ({
  type: DND_STARTED,
  sourceEvent,
  ref
});

export const dndEnded = (ref: StructReference, sourceEvent: React.DragEvent<any>): DNDEvent => ({
  type: DND_ENDED,
  sourceEvent,
  ref
});

export const dndHandled = (): BaseEvent => ({
  type: DND_HANDLED
});

export const artboardMounted = (artboardId: string): ArtboardMounted => ({
  type: ARTBOARD_MOUNTED,
  artboardId
});

export const artboardDOMComputedInfo = (artboardId: string, computedInfo: ComputedDOMInfo): ArtboardDOMInfoComputed => ({
  artboardId,
  computedInfo,
  type: ARTBOARD_DOM_INFO_COMPUTED,
});

export const cssDeclarationNameChanged = (index: number, name: string, value: string, ownerId: string, artboardId: string): CSSDeclarationChanged => ({
  ownerId,
  artboardId,
  index,
  name,
  value,
  type: CSS_DECLARATION_NAME_CHANGED
});

export const cssDeclarationValueChanged = (index: number, name: string, value: string, ownerId: string, artboardId: string): CSSDeclarationChanged => ({
  ownerId,
  artboardId,
  index,
  name,
  value,
  type: CSS_DECLARATION_VALUE_CHANGED
});

export const cssDeclarationCreated = (index: number, name: string, value: string, ownerId: string, artboardId: string): CSSDeclarationChanged => ({
  artboardId,
  index,
  name,
  value,
  ownerId,
  type: CSS_DECLARATION_CREATED
});

export const artboardLoaded = (artboardId, dependencyUris: string[], document: SlimParentNode, checksum: string, mount: HTMLIFrameElement): ArtboardLoaded => ({
  type: ARTBOARD_LOADED,
  artboardId,
  document, 
  checksum,
  dependencyUris,
  mount
});

export const exceptionCaught = (error?: { message: string }): ExceptionCaught => ({
  type: EXCEPTION_CAUGHT,
  error,
});

export const artboardPatched = (artboardId: string, document: SlimParentNode, checksum: string, nativeObjectMap: NativeObjectMap): ArtboardPatched => ({
  type: ARTBOARD_PATCHED,
  nativeObjectMap,
  checksum,
  artboardId,
  document
});

export const artboardDOMPatched = (artboardId: string, nativeObjectMap: NativeObjectMap): ArtboardDOMPatched => ({
  type: ARTBOARD_DOM_PATCHED,
  nativeObjectMap,
  artboardId
});

export const windowResized = (width: number, height: number): WindowResized => ({
  type: WINDOW_RESIZED,
  width,
  height
});

export const stageResized = (width: number, height: number): StageResized => ({
  type: STAGE_RESIZED,
  width,
  height
});

export const artboardLoading = (artboardId: string): ArtboardLoading => ({
  type: ARTBOARD_LOADING,
  artboardId
});

export const artboardRendered = (artboardId: string, nativeObjectMap: NativeObjectMap): ArtboardRendered => ({
  type: ARTBOARD_RENDERED,
  artboardId,
  nativeObjectMap
});

export const artboardCreated = (artboard: Artboard): ArtboardCreated => ({
  type: ARTBOARD_CREATED,
  artboard,
});

export const cssDeclarationTitleMouseEnter = (ruleId: string, artboardId: string): CSSDeclarationTitleMouseLeaveEnter => ({
  artboardId,
  ruleId,
  type: CSS_DECLARATION_TITLE_MOUSE_ENTER
});

export const sourceClicked = (itemId: string, artboardId: string): SourceClicked => ({
  artboardId,
  itemId,
  type: SOURCE_CLICKED
});

export const cssDeclarationTitleMouseLeave = (ruleId: string, artboardId: string): CSSDeclarationTitleMouseLeaveEnter => ({
  artboardId,
  ruleId,
  type: CSS_DECLARATION_TITLE_MOUSE_LEAVE
});

export const resizerStoppedMoving = (workspaceId: string, point: Point): ResizerMoved => ({
  workspaceId,
  point,
  type: RESIZER_STOPPED_MOVING,
});

export const breadcrumbItemClicked = (nodeId: string, artboardId: string): BreadcrumbItemClicked => ({
  nodeId,
  artboardId,
  type: BREADCRUMB_ITEM_CLICKED
})

export const breadcrumbItemMouseEnter = (nodeId: string, artboardId: string): BreadcrumbItemMouseEnterLeave => ({
  nodeId,
  artboardId,
  type: BREADCRUMB_ITEM_MOUSE_ENTER
})

export const breadcrumbItemMouseLeave = (nodeId: string, artboardId: string): BreadcrumbItemMouseEnterLeave => ({
  nodeId,
  artboardId,
  type: BREADCRUMB_ITEM_MOUSE_LEAVE
})

export const artboardSelectionShifted = (artboardId: string): ArtboardSelectionShifted => ({
  artboardId,
  type: ARTBOARD_SELECTION_SHIFTED,
});

export const resizerMouseDown = (workspaceId: string, sourceEvent: React.MouseEvent<any>): ResizerMouseDown => ({
  workspaceId,
  sourceEvent,
  type: RESIZER_MOUSE_DOWN,
});

export const stageToolOverlayMouseLeave = (sourceEvent: React.MouseEvent<any>): StageToolOverlayMouseMoved => ({
  type: STAGE_TOOL_OVERLAY_MOUSE_LEAVE,
  sourceEvent
});

export const stageToolOverlayMousePanStart = (artboardId: string): StageToolOverlayMousePanStart => ({
  artboardId,
  type: STAGE_TOOL_OVERLAY_MOUSE_PAN_START,
});

export const artboardFocused = (artboardId: string): ArtboardFocused => ({
  type: ARTBOARD_FOCUSED,
  artboardId
})

export const stageToolOverlayMousePanning = (artboardId: string, center: Point, deltaY: number, velocityY: number): StageToolOverlayMousePanning => ({
  artboardId,
  center,
  deltaY,
  velocityY,
  type: STAGE_TOOL_OVERLAY_MOUSE_PANNING,
});

export const stageToolOverlayMousePanEnd = (artboardId: string): StageToolOverlayMousePanEnd => ({
  artboardId,
  type: STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
});

export const fullScreenTargetDeleted = () => ({
  type: FULL_SCREEN_TARGET_DELETED
});

export const loadedSavedState = (state: ApplicationState): LoadedSavedState => ({
  type: LOADED_SAVED_STATE,
  state
});

export const triedLoadedSavedState = () => ({
  type: TRIED_LOADING_APP_STATE,
});

export const stageToolOverlayMouseDoubleClicked = (artboardId: string, sourceEvent: React.MouseEvent<any>): StageToolOverlayClicked => ({
  artboardId,
  type: STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
  sourceEvent
});

export const artboardScroll = (artboardId: string, scrollPosition: Point): ArtboardScroll => ({
  scrollPosition,
  artboardId,
  type: ARTBOARD_SCROLL
});

export const selectorDoubleClicked = (item: Struct, sourceEvent: React.MouseEvent<any>): SelectorDoubleClicked => ({
  item,
  type: SELECTOR_DOUBLE_CLICKED,
  sourceEvent
});

export const resizerPathMoved = (workspaceId: string, anchor: Point, originalBounds: Bounds, newBounds: Bounds, sourceEvent: MouseEvent): ResizerPathMoved => ({
  type: RESIZER_PATH_MOUSE_MOVED,
  workspaceId,
  anchor,
  originalBounds,
  newBounds,
  sourceEvent,
});

export const resizerPathStoppedMoving = (workspaceId: string, sourceEvent): ResizerPathStoppedMoving => ({
  type: RESIZER_PATH_MOUSE_STOPPED_MOVING,
  workspaceId,
  sourceEvent: {...sourceEvent}
});

export const artboardPaneRowClicked = (artboardId: string, sourceEvent: React.MouseEvent<any>): ArtboardPaneRowClicked => ({
  artboardId,
  sourceEvent,
  type: ARTBOARD_PANE_ROW_CLICKED
});

export const workspaceSelectionDeleted = (workspaceId: string): WorkspaceSelectionDeleted => ({
  workspaceId,
  type: WORKSPACE_DELETION_SELECTED
});

export const promptedNewWindowUrl = (workspaceId: string, location: string): PromptedNewWindowUrl => ({
  location,
  workspaceId,
  type: PROMPTED_NEW_WINDOW_URL
});

export const stageToolEditTextChanged = (nodeId: string, sourceEvent: React.ChangeEvent<any>): StageToolEditTextChanged => ({
  type: STAGE_TOOL_EDIT_TEXT_CHANGED,
  nodeId,
  sourceEvent
});

export const stageToolEditTextKeyDown = (nodeId: string, sourceEvent: React.KeyboardEvent<any>): StageToolEditTextKeyDown => ({
  type: STAGE_TOOL_EDIT_TEXT_KEY_DOWN,
  nodeId,
  sourceEvent
});

export const stageToolEditTextBlur = (nodeId: string, sourceEvent: React.FocusEvent<any>): StageToolEditTextBlur => ({
  nodeId,
  type: STAGE_TOOL_EDIT_TEXT_BLUR,
  sourceEvent
});

export const deleteShortcutPressed = (): BaseEvent => ({
  type: DELETE_SHORCUT_PRESSED,
});

export const fullScreenShortcutPressed = (): BaseEvent => ({
  type: FULL_SCREEN_SHORTCUT_PRESSED,
});

export const emptyWindowsUrlAdded = (url: string): EmptyWindowsUrlAdded => ({
  type: EMPTY_WINDOWS_URL_ADDED,
  url,
});

export const zoomInShortcutPressed = (): BaseEvent => ({
  type: ZOOM_IN_SHORTCUT_PRESSED,
});

export const zoomOutShortcutPressed = (): BaseEvent => ({
  type: ZOOM_OUT_SHORTCUT_PRESSED,
});

export const openNewWindowShortcutPressed = (): BaseEvent => ({
  type: OPEN_NEW_WINDOW_SHORTCUT_PRESSED,
});

export const cloneWindowShortcutPressed = (): BaseEvent => ({
  type: CLONE_WINDOW_SHORTCUT_PRESSED,
});

export const escapeShortcutPressed = (): BaseEvent => ({
  type: ESCAPE_SHORTCUT_PRESSED,
});

export const nextArtboardShortcutPressed = (): BaseEvent => ({
  type: NEXT_ARTBOARD_SHORTCUT_PRESSED,
});

export const prevArtboardShortcutPressed = (): BaseEvent => ({
  type: PREV_ARTBOARD_SHORTCUT_PRESSED,
});

export const toggleToolsShortcutPressed = (): BaseEvent => ({
  type: TOGGLE_TOOLS_SHORTCUT_PRESSED,
});

export const toggleTextEditorPressed = (): BaseEvent => ({
  type: TOGGLE_TEXT_EDITOR_PRESSED,
});

export const toggleLeftGutterPressed = (): BaseEvent => ({
  type: TOGGLE_LEFT_GUTTER_PRESSED,
});

export const toggleRightGutterPressed = (): BaseEvent => ({
  type: TOGGLE_RIGHT_GUTTER_PRESSED,
});

export const stageWheel = (workspaceId: string, canvasWidth: number, canvasHeight: number, { metaKey, ctrlKey, deltaX, deltaY, clientX, clientY }: React.WheelEvent<any>): StageWheel => ({
  workspaceId,
  metaKey,
  canvasWidth,
  canvasHeight,
  ctrlKey,
  deltaX,
  deltaY,
  type: VISUAL_EDITOR_WHEEL,
});

export const stageContainerMounted = (element: HTMLDivElement): StageMounted => ({
  element,
  type: STAGE_MOUNTED,
})

export const stageMouseMoved = (sourceEvent: React.MouseEvent<any>): WrappedEvent<React.MouseEvent<any>> => ({
  sourceEvent,
  type: STAGE_MOUSE_MOVED,
});

export const stageMouseClicked = (sourceEvent: React.MouseEvent<any>): WrappedEvent<React.MouseEvent<any>> => ({
  sourceEvent,
  type: STAGE_MOUSE_CLICKED,
});

export const apiComponentsLoaded = (components: AvailableComponent[]): APIComponentsLoaded => ({
  type: API_COMPONENTS_LOADED,
  components
})