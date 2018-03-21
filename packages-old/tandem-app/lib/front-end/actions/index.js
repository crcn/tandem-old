"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESIZER_MOVED = "RESIZER_MOVED";
exports.LOADED_SAVED_STATE = "LOADED_SAVED_STATE";
exports.TRIED_LOADING_APP_STATE = "TRIED_LOADING_APP_STATE";
exports.RESIZER_STOPPED_MOVING = "RESIZER_STOPPED_MOVING";
exports.RESIZER_MOUSE_DOWN = "RESIZER_MOUSE_DOWN";
exports.ARTBOARD_PANE_ROW_CLICKED = "ARTBOARD_PANE_ROW_CLICKED";
exports.PROMPTED_NEW_WINDOW_URL = "PROMPTED_NEW_WINDOW_URL";
exports.KEYBOARD_SHORTCUT_ADDED = "KEYBOARD_SHORTCUT_ADDED";
exports.DELETE_SHORCUT_PRESSED = "DELETE_SHORCUT_PRESSED";
exports.FULL_SCREEN_SHORTCUT_PRESSED = "FULL_SCREEN_SHORTCUT_PRESSED";
exports.WINDOW_RESIZED = "WINDOW_RESIZED";
exports.EMPTY_WINDOWS_URL_ADDED = "EMPTY_WINDOWS_URL_ADDED";
exports.ZOOM_IN_SHORTCUT_PRESSED = "ZOOM_IN_SHORTCUT_PRESSED";
exports.ZOOM_OUT_SHORTCUT_PRESSED = "ZOOM_OUT_SHORTCUT_PRESSED";
exports.OPEN_NEW_WINDOW_SHORTCUT_PRESSED = "OPEN_NEW_WINDOW_SHORTCUT_PRESSED";
exports.ARTBOARD_SELECTION_SHIFTED = "ARTBOARD_SELECTION_SHIFTED";
exports.CLONE_WINDOW_SHORTCUT_PRESSED = "CLONE_WINDOW_SHORTCUT_PRESSED";
exports.ESCAPE_SHORTCUT_PRESSED = "ESCAPE_SHORTCUT_PRESSED";
exports.NEXT_ARTBOARD_SHORTCUT_PRESSED = "NEXT_ARTBOARD_SHORTCUT_PRESSED";
exports.PREV_ARTBOARD_SHORTCUT_PRESSED = "PREV_ARTBOARD_SHORTCUT_PRESSED";
exports.TOGGLE_TOOLS_SHORTCUT_PRESSED = "TOGGLE_TOOLS_SHORTCUT_PRESSED";
exports.FULL_SCREEN_TARGET_DELETED = "FULL_SCREEN_TARGET_DELETED";
exports.TOGGLE_TEXT_EDITOR_PRESSED = "TOGGLE_TEXT_EDITOR_PRESSED";
exports.TOGGLE_LEFT_GUTTER_PRESSED = "TOGGLE_LEFT_GUTTER_PRESSED";
exports.TOGGLE_RIGHT_GUTTER_PRESSED = "TOGGLE_RIGHT_GUTTER_PRESSED";
exports.RESIZER_PATH_MOUSE_MOVED = "RESIZER_PATH_MOUSE_MOVED";
exports.RESIZER_PATH_MOUSE_STOPPED_MOVING = "RESIZER_PATH_MOUSE_STOPPED_MOVING";
exports.TEXT_EDITOR_CHANGED = "TEXT_EDITOR_CHANGED";
exports.CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED = "CANVAS_ELEMENTS_COMPUTED_PROPS_CHANGED";
exports.CANVAS_MOTION_RESTED = "CANVAS_MOTION_RESTED";
exports.TREE_NODE_LABEL_CLICKED = "TREE_NODE_LABE_CLICKED";
exports.FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FILE_BUTTON_CLICKED";
exports.FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
exports.BANNER_CLOSED = "BANNER_CLOSED";
exports.OPEN_ARTBOARDS_REQUESTED = "OPEN_ARTBOARDS_REQUESTED";
exports.FILE_REMOVED = "FILE_REMOVED";
exports.COMPONENT_SCREENSHOT_SAVED = "COMPONENT_SCREENSHOT_SAVED";
exports.COMPONENTS_PANE_ADD_COMPONENT_CLICKED = "COMPONENTS_PANE_ADD_COMPONENT_CLICKED";
exports.COMPONENTS_PANE_COMPONENT_CLICKED = "COMPONENTS_PANE_COMPONENT_CLICKED";
exports.ARTBOARD_MOUNTED = "ARTBOARD_MOUNTED";
exports.ARTBOARD_DOM_INFO_COMPUTED = "ARTBOARD_DOM_INFO_COMPUTED";
exports.BREADCRUMB_ITEM_CLICKED = "BREADCRUMB_ITEM_CLICKED";
exports.BREADCRUMB_ITEM_MOUSE_ENTER = "BREADCRUMB_ITEM_MOUSE_ENTER";
exports.BREADCRUMB_ITEM_MOUSE_LEAVE = "BREADCRUMB_ITEM_MOUSE_LEAVE";
exports.FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED = "FILE_NAVIGATOR_ADD_FOLDER_BUTTON_CLICKED";
exports.STAGE_MOUSE_MOVED = "STAGE_MOUSE_MOVED";
exports.STAGE_MOUSE_CLICKED = "STAGE_MOUSE_CLICKED";
exports.VISUAL_EDITOR_WHEEL = "VISUAL_EDITOR_WHEEL";
exports.STAGE_TOOL_ARTBOARD_TITLE_CLICKED = "STAGE_TOOL_ARTBOARD_TITLE_CLICKED";
exports.PREVIEW_DIFFED = "PREVIEW_DIFFED";
exports.ARTBOARD_LOADED = "ARTBOARD_LOADED";
exports.ARTBOARD_PATCHED = "ARTBOARD_PATCHED";
exports.ARTBOARD_DOM_PATCHED = "ARTBOARD_DOM_PATCHED";
exports.ARTBOARD_SCROLL = "ARTBOARD_SCROLL";
exports.ARTBOARD_RENDERED = "ARTBOARD_RENDERED";
exports.ARTBOARD_LOADING = "ARTBOARD_LOADING";
exports.ARTBOARD_CREATED = "ARTBOARD_CREATED";
exports.DOWN_KEY_DOWN = "DOWN_KEY_DOWN";
exports.DOWN_KEY_UP = "DOWN_KEY_UP";
exports.UP_KEY_DOWN = "UP_KEY_DOWN";
exports.UP_KEY_UP = "UP_KEY_UP";
exports.LEFT_KEY_DOWN = "LEFT_KEY_DOWN";
exports.STAGE_RESIZED = "STAGE_RESIZED";
exports.LEFT_KEY_UP = "LEFT_KEY_UP";
exports.RIGHT_KEY_DOWN = "RIGHT_KEY_DOWN";
exports.RIGHT_KEY_UP = "RIGHT_KEY_UP";
exports.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED = "STAGE_TOOL_WINDOW_BACKGROUND_CLICKED";
exports.DISPLAY_SOURCE_CODE_REQUESTED = "DISPLAY_SOURCE_CODE_REQUESTED";
exports.STAGE_TOOL_OVERLAY_MOUSE_LEAVE = "STAGE_TOOL_OVERLAY_MOUSE_LEAVE";
exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_START = "STAGE_TOOL_OVERLAY_MOUSE_PAN_START";
exports.STAGE_TOOL_OVERLAY_MOUSE_PANNING = "STAGE_TOOL_OVERLAY_MOUSE_PANNING";
exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_END = "STAGE_TOOL_OVERLAY_MOUSE_PAN_END";
exports.STAGE_TOOL_WINDOW_KEY_DOWN = "STAGE_TOOL_WINDOW_KEY_DOWN";
exports.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED = "OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED";
exports.WORKSPACE_DELETION_SELECTED = "WORKSPACE_DELETION_SELECTED";
exports.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED = "STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED";
exports.SELECTOR_DOUBLE_CLICKED = "SELECTOR_DOUBLE_CLICKED";
exports.STAGE_TOOL_EDIT_TEXT_CHANGED = "STAGE_TOOL_EDIT_TEXT_CHANGED";
exports.STAGE_TOOL_EDIT_TEXT_KEY_DOWN = "STAGE_TOOL_EDIT_TEXT_KEY_DOWN";
exports.STAGE_TOOL_EDIT_TEXT_BLUR = "STAGE_TOOL_EDIT_TEXT_BLUR";
exports.STAGE_MOUNTED = "STAGE_MOUNTED";
exports.CSS_DECLARATION_NAME_CHANGED = "CSS_DECLARATION_NAME_CHANGED";
exports.CSS_DECLARATION_VALUE_CHANGED = "CSS_DECLARATION_VALUE_CHANGED";
exports.CSS_SELECTOR_TEXT_CHANGED = "CSS_SELECTOR_TEXT_CHANGED";
exports.ARTBOARD_FOCUSED = "ARTBOARD_FOCUSED";
exports.CSS_DECLARATION_CREATED = "CSS_DECLARATION_CREATED";
exports.CSS_DECLARATION_TITLE_MOUSE_ENTER = "CSS_DECLARATION_TITLE_MOUSE_ENTER";
exports.SOURCE_CLICKED = "SOURCE_CLICKED";
exports.CSS_DECLARATION_TITLE_MOUSE_LEAVE = "CSS_DECLARATION_TITLE_MOUSE_LEAVE";
exports.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED = "TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED";
exports.CSS_TOGGLE_DECLARATION_EYE_CLICKED = "CSS_TOGGLE_DECLARATION_EYE_CLICKED";
exports.API_COMPONENTS_LOADED = "API_COMPONENTS_LOADED";
exports.DND_STARTED = "DND_STARTED";
exports.DND_ENDED = "DND_ENDED";
exports.DND_HANDLED = "DND_HANDLED";
exports.EXCEPTION_CAUGHT = "EXCEPTION_CAUGHT";
exports.componentsPaneAddComponentClicked = function () { return ({
    type: exports.COMPONENTS_PANE_ADD_COMPONENT_CLICKED
}); };
exports.componentsPaneComponentClicked = function (componentId, sourceEvent) { return ({
    type: exports.COMPONENTS_PANE_COMPONENT_CLICKED,
    sourceEvent: sourceEvent,
    componentId: componentId
}); };
exports.canvasMotionRested = function () { return ({
    type: exports.CANVAS_MOTION_RESTED
}); };
exports.treeNodeLabelClicked = function (node) { return ({ type: exports.TREE_NODE_LABEL_CLICKED, node: node }); };
exports.stageToolArtboardTitleClicked = function (artboardId, sourceEvent) { return ({ type: exports.STAGE_TOOL_ARTBOARD_TITLE_CLICKED, artboardId: artboardId, sourceEvent: sourceEvent }); };
exports.stageToolWindowKeyDown = function (artboardId, sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_KEY_DOWN, artboardId: artboardId, sourceEvent: sourceEvent }); };
exports.openExternalWindowButtonClicked = function (artboardId, sourceEvent) { return ({ type: exports.OPEN_EXTERNAL_WINDOW_BUTTON_CLICKED, artboardId: artboardId, sourceEvent: sourceEvent }); };
exports.stageToolWindowBackgroundClicked = function (sourceEvent) { return ({ type: exports.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED, sourceEvent: sourceEvent }); };
// TODO - possible include CSS url, or artboardId
exports.toggleCSSTargetSelectorClicked = function (itemId, artboardId) { return ({
    type: exports.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED,
    artboardId: artboardId,
    itemId: itemId,
}); };
exports.cssToggleDeclarationEyeClicked = function (artboardId, itemId, declarationName, index) { return ({
    index: index,
    type: exports.CSS_TOGGLE_DECLARATION_EYE_CLICKED,
    artboardId: artboardId,
    itemId: itemId,
    declarationName: declarationName,
}); };
exports.resizerMoved = function (workspaceId, point) { return ({
    workspaceId: workspaceId,
    point: point,
    type: exports.RESIZER_MOVED,
}); };
exports.bannerClosed = function () { return ({
    type: exports.BANNER_CLOSED
}); };
exports.dndStarted = function (ref, sourceEvent) { return ({
    type: exports.DND_STARTED,
    sourceEvent: sourceEvent,
    ref: ref
}); };
exports.dndEnded = function (ref, sourceEvent) { return ({
    type: exports.DND_ENDED,
    sourceEvent: sourceEvent,
    ref: ref
}); };
exports.dndHandled = function () { return ({
    type: exports.DND_HANDLED
}); };
exports.artboardMounted = function (artboardId) { return ({
    type: exports.ARTBOARD_MOUNTED,
    artboardId: artboardId
}); };
exports.artboardDOMComputedInfo = function (artboardId, computedInfo) { return ({
    artboardId: artboardId,
    computedInfo: computedInfo,
    type: exports.ARTBOARD_DOM_INFO_COMPUTED,
}); };
exports.cssDeclarationNameChanged = function (index, name, value, ownerId, artboardId) { return ({
    ownerId: ownerId,
    artboardId: artboardId,
    index: index,
    name: name,
    value: value,
    type: exports.CSS_DECLARATION_NAME_CHANGED
}); };
exports.cssDeclarationValueChanged = function (index, name, value, ownerId, artboardId) { return ({
    ownerId: ownerId,
    artboardId: artboardId,
    index: index,
    name: name,
    value: value,
    type: exports.CSS_DECLARATION_VALUE_CHANGED
}); };
exports.cssDeclarationCreated = function (index, name, value, ownerId, artboardId) { return ({
    artboardId: artboardId,
    index: index,
    name: name,
    value: value,
    ownerId: ownerId,
    type: exports.CSS_DECLARATION_CREATED
}); };
exports.cssSelectorTextChanged = function (styleRuleId, newSelectorText, artboardId) { return ({
    styleRuleId: styleRuleId,
    artboardId: artboardId,
    newSelectorText: newSelectorText,
    type: exports.CSS_SELECTOR_TEXT_CHANGED
}); };
exports.artboardLoaded = function (artboardId, dependencyUris, document, checksum, mount) { return ({
    type: exports.ARTBOARD_LOADED,
    artboardId: artboardId,
    document: document,
    checksum: checksum,
    dependencyUris: dependencyUris,
    mount: mount
}); };
exports.exceptionCaught = function (error) { return ({
    type: exports.EXCEPTION_CAUGHT,
    error: error,
}); };
exports.artboardPatched = function (artboardId, document, checksum, nativeObjectMap) { return ({
    type: exports.ARTBOARD_PATCHED,
    nativeObjectMap: nativeObjectMap,
    checksum: checksum,
    artboardId: artboardId,
    document: document
}); };
exports.artboardDOMPatched = function (artboardId, nativeObjectMap) { return ({
    type: exports.ARTBOARD_DOM_PATCHED,
    nativeObjectMap: nativeObjectMap,
    artboardId: artboardId
}); };
exports.windowResized = function (width, height) { return ({
    type: exports.WINDOW_RESIZED,
    width: width,
    height: height
}); };
exports.stageResized = function (width, height) { return ({
    type: exports.STAGE_RESIZED,
    width: width,
    height: height
}); };
exports.artboardLoading = function (artboardId) { return ({
    type: exports.ARTBOARD_LOADING,
    artboardId: artboardId
}); };
exports.artboardRendered = function (artboardId, nativeObjectMap) { return ({
    type: exports.ARTBOARD_RENDERED,
    artboardId: artboardId,
    nativeObjectMap: nativeObjectMap
}); };
exports.artboardCreated = function (artboard) { return ({
    type: exports.ARTBOARD_CREATED,
    artboard: artboard,
}); };
exports.cssDeclarationTitleMouseEnter = function (ruleId, artboardId) { return ({
    artboardId: artboardId,
    ruleId: ruleId,
    type: exports.CSS_DECLARATION_TITLE_MOUSE_ENTER
}); };
exports.sourceClicked = function (itemId, artboardId) { return ({
    artboardId: artboardId,
    itemId: itemId,
    type: exports.SOURCE_CLICKED
}); };
exports.cssDeclarationTitleMouseLeave = function (ruleId, artboardId) { return ({
    artboardId: artboardId,
    ruleId: ruleId,
    type: exports.CSS_DECLARATION_TITLE_MOUSE_LEAVE
}); };
exports.resizerStoppedMoving = function (workspaceId, point) { return ({
    workspaceId: workspaceId,
    point: point,
    type: exports.RESIZER_STOPPED_MOVING,
}); };
exports.breadcrumbItemClicked = function (nodeId, artboardId) { return ({
    nodeId: nodeId,
    artboardId: artboardId,
    type: exports.BREADCRUMB_ITEM_CLICKED
}); };
exports.breadcrumbItemMouseEnter = function (nodeId, artboardId) { return ({
    nodeId: nodeId,
    artboardId: artboardId,
    type: exports.BREADCRUMB_ITEM_MOUSE_ENTER
}); };
exports.breadcrumbItemMouseLeave = function (nodeId, artboardId) { return ({
    nodeId: nodeId,
    artboardId: artboardId,
    type: exports.BREADCRUMB_ITEM_MOUSE_LEAVE
}); };
exports.artboardSelectionShifted = function (artboardId) { return ({
    artboardId: artboardId,
    type: exports.ARTBOARD_SELECTION_SHIFTED,
}); };
exports.resizerMouseDown = function (workspaceId, sourceEvent) { return ({
    workspaceId: workspaceId,
    sourceEvent: sourceEvent,
    type: exports.RESIZER_MOUSE_DOWN,
}); };
exports.stageToolOverlayMouseLeave = function (sourceEvent) { return ({
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_LEAVE,
    sourceEvent: sourceEvent
}); };
exports.stageToolOverlayMousePanStart = function (artboardId) { return ({
    artboardId: artboardId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_START,
}); };
exports.artboardFocused = function (artboardId) { return ({
    type: exports.ARTBOARD_FOCUSED,
    artboardId: artboardId
}); };
exports.stageToolOverlayMousePanning = function (artboardId, center, deltaY, velocityY) { return ({
    artboardId: artboardId,
    center: center,
    deltaY: deltaY,
    velocityY: velocityY,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PANNING,
}); };
exports.stageToolOverlayMousePanEnd = function (artboardId) { return ({
    artboardId: artboardId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_PAN_END,
}); };
exports.fullScreenTargetDeleted = function () { return ({
    type: exports.FULL_SCREEN_TARGET_DELETED
}); };
exports.loadedSavedState = function (state) { return ({
    type: exports.LOADED_SAVED_STATE,
    state: state
}); };
exports.triedLoadedSavedState = function () { return ({
    type: exports.TRIED_LOADING_APP_STATE,
}); };
exports.stageToolOverlayMouseDoubleClicked = function (artboardId, sourceEvent) { return ({
    artboardId: artboardId,
    type: exports.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED,
    sourceEvent: sourceEvent
}); };
exports.artboardScroll = function (artboardId, scrollPosition) { return ({
    scrollPosition: scrollPosition,
    artboardId: artboardId,
    type: exports.ARTBOARD_SCROLL
}); };
exports.selectorDoubleClicked = function (item, sourceEvent) { return ({
    item: item,
    type: exports.SELECTOR_DOUBLE_CLICKED,
    sourceEvent: sourceEvent
}); };
exports.resizerPathMoved = function (workspaceId, anchor, originalBounds, newBounds, sourceEvent) { return ({
    type: exports.RESIZER_PATH_MOUSE_MOVED,
    workspaceId: workspaceId,
    anchor: anchor,
    originalBounds: originalBounds,
    newBounds: newBounds,
    sourceEvent: sourceEvent,
}); };
exports.resizerPathStoppedMoving = function (workspaceId, sourceEvent) { return ({
    type: exports.RESIZER_PATH_MOUSE_STOPPED_MOVING,
    workspaceId: workspaceId,
    sourceEvent: __assign({}, sourceEvent)
}); };
exports.artboardPaneRowClicked = function (artboardId, sourceEvent) { return ({
    artboardId: artboardId,
    sourceEvent: sourceEvent,
    type: exports.ARTBOARD_PANE_ROW_CLICKED
}); };
exports.workspaceSelectionDeleted = function (workspaceId) { return ({
    workspaceId: workspaceId,
    type: exports.WORKSPACE_DELETION_SELECTED
}); };
exports.promptedNewWindowUrl = function (workspaceId, location) { return ({
    location: location,
    workspaceId: workspaceId,
    type: exports.PROMPTED_NEW_WINDOW_URL
}); };
exports.stageToolEditTextChanged = function (nodeId, sourceEvent) { return ({
    type: exports.STAGE_TOOL_EDIT_TEXT_CHANGED,
    nodeId: nodeId,
    sourceEvent: sourceEvent
}); };
exports.stageToolEditTextKeyDown = function (nodeId, sourceEvent) { return ({
    type: exports.STAGE_TOOL_EDIT_TEXT_KEY_DOWN,
    nodeId: nodeId,
    sourceEvent: sourceEvent
}); };
exports.stageToolEditTextBlur = function (nodeId, sourceEvent) { return ({
    nodeId: nodeId,
    type: exports.STAGE_TOOL_EDIT_TEXT_BLUR,
    sourceEvent: sourceEvent
}); };
exports.deleteShortcutPressed = function () { return ({
    type: exports.DELETE_SHORCUT_PRESSED,
}); };
exports.fullScreenShortcutPressed = function () { return ({
    type: exports.FULL_SCREEN_SHORTCUT_PRESSED,
}); };
exports.emptyWindowsUrlAdded = function (url) { return ({
    type: exports.EMPTY_WINDOWS_URL_ADDED,
    url: url,
}); };
exports.zoomInShortcutPressed = function () { return ({
    type: exports.ZOOM_IN_SHORTCUT_PRESSED,
}); };
exports.zoomOutShortcutPressed = function () { return ({
    type: exports.ZOOM_OUT_SHORTCUT_PRESSED,
}); };
exports.openNewWindowShortcutPressed = function () { return ({
    type: exports.OPEN_NEW_WINDOW_SHORTCUT_PRESSED,
}); };
exports.cloneWindowShortcutPressed = function () { return ({
    type: exports.CLONE_WINDOW_SHORTCUT_PRESSED,
}); };
exports.escapeShortcutPressed = function () { return ({
    type: exports.ESCAPE_SHORTCUT_PRESSED,
}); };
exports.nextArtboardShortcutPressed = function () { return ({
    type: exports.NEXT_ARTBOARD_SHORTCUT_PRESSED,
}); };
exports.prevArtboardShortcutPressed = function () { return ({
    type: exports.PREV_ARTBOARD_SHORTCUT_PRESSED,
}); };
exports.toggleToolsShortcutPressed = function () { return ({
    type: exports.TOGGLE_TOOLS_SHORTCUT_PRESSED,
}); };
exports.toggleTextEditorPressed = function () { return ({
    type: exports.TOGGLE_TEXT_EDITOR_PRESSED,
}); };
exports.toggleLeftGutterPressed = function () { return ({
    type: exports.TOGGLE_LEFT_GUTTER_PRESSED,
}); };
exports.toggleRightGutterPressed = function () { return ({
    type: exports.TOGGLE_RIGHT_GUTTER_PRESSED,
}); };
exports.stageWheel = function (workspaceId, canvasWidth, canvasHeight, _a) {
    var metaKey = _a.metaKey, ctrlKey = _a.ctrlKey, deltaX = _a.deltaX, deltaY = _a.deltaY, clientX = _a.clientX, clientY = _a.clientY;
    return ({
        workspaceId: workspaceId,
        metaKey: metaKey,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ctrlKey: ctrlKey,
        deltaX: deltaX,
        deltaY: deltaY,
        type: exports.VISUAL_EDITOR_WHEEL,
    });
};
exports.stageContainerMounted = function (element) { return ({
    element: element,
    type: exports.STAGE_MOUNTED,
}); };
exports.stageMouseMoved = function (sourceEvent) { return ({
    sourceEvent: sourceEvent,
    type: exports.STAGE_MOUSE_MOVED,
}); };
exports.stageMouseClicked = function (sourceEvent) { return ({
    sourceEvent: sourceEvent,
    type: exports.STAGE_MOUSE_CLICKED,
}); };
exports.apiComponentsLoaded = function (components) { return ({
    type: exports.API_COMPONENTS_LOADED,
    components: components
}); };
//# sourceMappingURL=index.js.map