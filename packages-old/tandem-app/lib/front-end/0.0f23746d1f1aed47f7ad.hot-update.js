webpackHotUpdate(0,{

/***/ "./src/front-end/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/front-end/application.tsx"));
__export(__webpack_require__("./src/front-end/state/index.ts"));
__export(__webpack_require__("./src/front-end/reducers/index.ts"));
__export(__webpack_require__("./src/front-end/actions/index.ts"));


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/front-end/reducers/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = __webpack_require__("../aerial-common2/index.js");
var lodash_1 = __webpack_require__("./node_modules/lodash/lodash.js");
var state_1 = __webpack_require__("./src/front-end/state/index.ts");
var constants_1 = __webpack_require__("./src/front-end/constants/index.ts");
var actions_1 = __webpack_require__("./src/front-end/actions/index.ts");
var aerial_browser_sandbox_1 = __webpack_require__("../aerial-browser-sandbox/index.js");
exports.applicationReducer = function (state, event) {
    if (state === void 0) { state = state_1.createApplicationState(); }
    switch (event.type) {
        case actions_1.LOADED_SAVED_STATE: {
            var newState = event.state;
            state = lodash_1.merge({}, state, JSON.parse(JSON.stringify(newState)));
            return state;
        }
        case actions_1.TREE_NODE_LABEL_CLICKED: {
            var node = event.node;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                selectedFileId: node.$id
            });
        }
        case actions_1.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED: {
            var _a = event, itemId = _a.itemId, windowId = _a.windowId;
            var window_1 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var item = aerial_browser_sandbox_1.getSyntheticWindowChild(window_1, itemId);
            var workspace = state_1.getSyntheticWindowWorkspace(state, window_1.$id);
            state = state_1.toggleWorkspaceTargetCSSSelector(state, workspace.$id, item.source.uri, item.selectorText);
            return state;
        }
    }
    // state = canvasReducer(state, event);
    // state = syntheticBrowserReducer(state, event);
    state = aerial_browser_sandbox_1.syntheticBrowserReducer(state, event);
    state = stageReducer(state, event);
    state = windowPaneReducer(state, event);
    state = componentsPaneReducer(state, event);
    state = shortcutReducer(state, event);
    state = apiReducer(state, event);
    state = dndReducer(state, event);
    // state = externalReducer(state, event);
    return state;
};
var PANE_SENSITIVITY = process.platform === "win32" ? 0.1 : 1;
var ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;
var MIN_ZOOM = 0.02;
var MAX_ZOOM = 6400 / 100;
var INITIAL_ZOOM_PADDING = 50;
var apiReducer = function (state, event) {
    switch (event.type) {
        case actions_1.API_COMPONENTS_LOADED: {
            var components = event.components;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                availableComponents: constants_1.NATIVE_COMPONENTS.concat(components)
            });
        }
    }
    return state;
};
var componentsPaneReducer = function (state, event) {
    switch (event.type) {
        case actions_1.COMPONENTS_PANE_COMPONENT_CLICKED: {
            var componentId = event.componentId;
            return state_1.setWorkspaceSelection(state, state.selectedWorkspaceId, aerial_common2_1.getStructReference({ $id: componentId, $type: state_1.AVAILABLE_COMPONENT }));
        }
    }
    return state;
};
var shortcutReducer = function (state, event) {
    switch (event.type) {
        case actions_1.TOGGLE_LEFT_GUTTER_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showLeftGutter: !workspace.stage.showLeftGutter
            });
        }
        case actions_1.ESCAPE_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspace(state, workspace.$id, {
                selectionRefs: []
            });
        }
        case actions_1.ZOOM_IN_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            if (workspace.stage.fullScreen)
                return state;
            return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) * 2);
        }
        case actions_1.ZOOM_OUT_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            if (workspace.stage.fullScreen)
                return state;
            return setStageZoom(state, workspace.$id, normalizeZoom(workspace.stage.translate.zoom) / 2);
        }
        case actions_1.PREV_WINDOW_SHORTCUT_PRESSED: {
            return state;
        }
        case actions_1.FULL_SCREEN_TARGET_DELETED: {
            return unfullscreen(state);
        }
        case actions_1.FULL_SCREEN_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            var selection = workspace.selectionRefs[0];
            var windowId = selection ? selection[0] === aerial_browser_sandbox_1.SYNTHETIC_WINDOW ? selection[1] : aerial_browser_sandbox_1.getSyntheticNodeWindow(state, selection[1]) && aerial_browser_sandbox_1.getSyntheticNodeWindow(state, selection[1]).$id : null;
            if (windowId && !workspace.stage.fullScreen) {
                var window_2 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    smooth: true,
                    fullScreen: {
                        windowId: windowId,
                        originalTranslate: workspace.stage.translate,
                        originalWindowBounds: window_2.bounds
                    },
                    translate: {
                        zoom: 1,
                        left: -window_2.bounds.left,
                        top: -window_2.bounds.top
                    }
                });
                return state;
            }
            else if (workspace.stage.fullScreen) {
                return unfullscreen(state);
            }
            else {
                return state;
            }
        }
        case actions_1.CANVAS_MOTION_RESTED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                smooth: false
            });
        }
        case actions_1.TOGGLE_TEXT_EDITOR_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showTextEditor: !workspace.stage.showTextEditor
            });
        }
        case actions_1.TOGGLE_RIGHT_GUTTER_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showRightGutter: !workspace.stage.showRightGutter
            });
        }
    }
    return state;
};
var dndReducer = function (state, event) {
    switch (event.type) {
        case actions_1.DND_STARTED: {
            var ref = event.ref;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                draggingRefs: [ref]
            });
        }
        case actions_1.DND_HANDLED: {
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                draggingRefs: []
            });
        }
    }
    return state;
};
var stageReducer = function (state, event) {
    switch (event.type) {
        case actions_1.VISUAL_EDITOR_WHEEL: {
            var _a = event, workspaceId = _a.workspaceId, metaKey = _a.metaKey, ctrlKey = _a.ctrlKey, deltaX = _a.deltaX, deltaY = _a.deltaY, canvasHeight = _a.canvasHeight, canvasWidth = _a.canvasWidth;
            var workspace = state_1.getWorkspaceById(state, workspaceId);
            if (workspace.stage.fullScreen) {
                return state;
            }
            var translate = state_1.getStageTranslate(workspace.stage);
            if (metaKey || ctrlKey) {
                translate = aerial_common2_1.centerTransformZoom(translate, aerial_common2_1.boundsFromRect({
                    width: canvasWidth,
                    height: canvasHeight
                }), lodash_1.clamp(translate.zoom + translate.zoom * deltaY / ZOOM_SENSITIVITY, MIN_ZOOM, MAX_ZOOM), workspace.stage.mousePosition);
            }
            else {
                translate = __assign({}, translate, { left: translate.left - deltaX, top: translate.top - deltaY });
            }
            return state_1.updateWorkspaceStage(state, workspace.$id, { smooth: false, translate: translate });
        }
        case actions_1.TOGGLE_TOOLS_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.updateWorkspaceStage(state, workspace.$id, {
                showTools: workspace.stage.showTools == null ? false : !workspace.stage.showTools
            });
        }
        case actions_1.STAGE_TOOL_EDIT_TEXT_KEY_DOWN: {
            var _b = event, sourceEvent = _b.sourceEvent, nodeId = _b.nodeId;
            if (sourceEvent.key === "Escape") {
                var workspace = state_1.getSyntheticNodeWorkspace(state, nodeId);
                state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(aerial_browser_sandbox_1.getSyntheticNodeById(state, nodeId)));
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    secondarySelection: false
                });
            }
            return state;
        }
        case actions_1.RESIZER_PATH_MOUSE_MOVED:
        case actions_1.RESIZER_MOVED: {
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: true
            });
            return state;
        }
        case actions_1.RESIZER_PATH_MOUSE_STOPPED_MOVING:
        case actions_1.RESIZER_STOPPED_MOVING: {
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: false
            });
            return state;
        }
        case aerial_browser_sandbox_1.SYNTHETIC_WINDOW_PROXY_OPENED: {
            var instance = event.instance;
            // if a window instance exists in the store, then it's already visible on stage -- could
            // have been loaded from a saved state.
            var window_3 = aerial_browser_sandbox_1.getSyntheticWindow(state, instance.$id);
            if (window_3) {
                return state;
            }
            return selectAndCenterSyntheticWindow(state, instance.struct);
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_LEAVE: {
            var sourceEvent = event.sourceEvent;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_ENTER: {
            var _c = event, windowId = _c.windowId, ruleId = _c.ruleId;
            var window_4 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var selectorText = aerial_browser_sandbox_1.getSyntheticWindowChild(window_4, ruleId).selectorText;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: aerial_browser_sandbox_1.getMatchingElements(window_4, selectorText).map(function (element) { return [
                    element.$type,
                    element.$id
                ]; })
            });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_LEAVE: {
            var _d = event, windowId = _d.windowId, ruleId = _d.ruleId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.BREADCRUMB_ITEM_CLICKED: {
            var _e = event, windowId = _e.windowId, nodeId = _e.nodeId;
            var window_5 = aerial_browser_sandbox_1.getSyntheticWindow(state, windowId);
            var browser = state_1.getSyntheticWindowBrowser(state, window_5.$id);
            var node = aerial_browser_sandbox_1.getSyntheticNodeById(browser, nodeId);
            var workspace = state_1.getSyntheticWindowWorkspace(state, window_5.$id);
            return state_1.setWorkspaceSelection(state, workspace.$id, [node.$type, node.$id]);
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_ENTER: {
            var _f = event, windowId = _f.windowId, nodeId = _f.nodeId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: [[aerial_browser_sandbox_1.SYNTHETIC_ELEMENT, nodeId]]
            });
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_LEAVE: {
            var _g = event, windowId = _g.windowId, nodeId = _g.nodeId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.EMPTY_WINDOWS_URL_ADDED: {
            var workspaceId = state.selectedWorkspaceId;
            return centerStage(state, workspaceId, {
                left: 0,
                top: 0,
                right: aerial_browser_sandbox_1.DEFAULT_WINDOW_WIDTH,
                bottom: aerial_browser_sandbox_1.DEFAULT_WINDOW_HEIGHT
            }, false, true);
        }
        case actions_1.STAGE_MOUNTED:
            {
                var element = event.element;
                var _h = element.getBoundingClientRect() || {}, _j = _h.width, width = _j === void 0 ? 400 : _j, _k = _h.height, height = _k === void 0 ? 300 : _k;
                var workspaceId = state.selectedWorkspaceId;
                var workspace = state_1.getSelectedWorkspace(state);
                state = state_1.updateWorkspaceStage(state, workspaceId, { container: element });
                // do not center if in full screen mode
                if (workspace.stage.fullScreen) {
                    return state;
                }
                return centerSelectedWorkspace(state);
            }
            ;
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START: {
            var windowId = event.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: true });
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END: {
            var windowId = event.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: false });
        }
        case actions_1.STAGE_MOUSE_MOVED:
            {
                var _l = event.sourceEvent, pageX = _l.pageX, pageY = _l.pageY;
                state = state_1.updateWorkspaceStage(state, state.selectedWorkspaceId, {
                    mousePosition: {
                        left: pageX,
                        top: pageY
                    }
                });
                var workspace = state_1.getSelectedWorkspace(state);
                // TODO - in the future, we'll probably want to be able to highlight hovered nodes as the user is moving an element around to indicate where
                // they can drop the element. 
                var targetRef = workspace.stage.movingOrResizing ? null : state_1.getStageToolMouseNodeTargetReference(state, event);
                state = state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                    hoveringRefs: targetRef ? [targetRef] : []
                });
                return state;
            }
            ;
        case actions_1.STAGE_MOUSE_CLICKED: {
            var sourceEvent = event.sourceEvent;
            if (/textarea|input/i.test(sourceEvent.target.nodeName)) {
                return state;
            }
            // alt key opens up a new link
            var altKey = sourceEvent.altKey;
            var workspace = state_1.getSelectedWorkspace(state);
            state = updateWorkspaceStageSmoothing(state, workspace);
            // do not allow selection while window is panning (scrolling)
            if (workspace.stage.panning || workspace.stage.movingOrResizing)
                return state;
            var targetRef = state_1.getStageToolMouseNodeTargetReference(state, event);
            if (!targetRef) {
                return state;
            }
            if (!altKey) {
                state = handleWindowSelectionFromAction(state, targetRef, event);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    secondarySelection: false
                });
                return state;
            }
            return state;
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED: {
            var _m = event, sourceEvent = _m.sourceEvent, windowId = _m.windowId;
            var workspace = state_1.getSyntheticWindowWorkspace(state, windowId);
            var targetRef = state_1.getStageToolMouseNodeTargetReference(state, event);
            if (!targetRef)
                return state;
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, targetRef);
            return state;
        }
        case actions_1.WINDOW_SELECTION_SHIFTED: {
            var windowId = event.windowId;
            return selectAndCenterSyntheticWindow(state, aerial_browser_sandbox_1.getSyntheticWindow(state, windowId));
        }
        case actions_1.SELECTOR_DOUBLE_CLICKED: {
            var _o = event, sourceEvent = _o.sourceEvent, item = _o.item;
            var workspace = state_1.getSyntheticNodeWorkspace(state, item.$id);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(item));
            return state;
        }
        case actions_1.WORKSPACE_DELETION_SELECTED: {
            var workspaceId = event.workspaceId;
            state = state_1.clearWorkspaceSelection(state, workspaceId);
            return state;
        }
        case actions_1.STAGE_TOOL_WINDOW_TITLE_CLICKED: {
            state = updateWorkspaceStageSmoothing(state);
            return handleWindowSelectionFromAction(state, aerial_common2_1.getStructReference(aerial_browser_sandbox_1.getSyntheticWindow(state, event.windowId)), event);
        }
        case actions_1.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.clearWorkspaceSelection(state, workspace.$id);
        }
    }
    return state;
};
// const externalReducer = (state: ApplicationState, event: BaseEvent) => {
//   switch(event.type) {
//     case OPEN_EXTERNAL_WINDOWS_REQUESTED: {
//       console.log("REQ");
//       const { uris }: OpenExternalWindowsRequested = event;
//       const workspace = getWorkspaceById(state, state.selectedWorkspaceId);
//       const browser = getSyntheticBrowser(state, workspace.browserId);
//       const selection = [];
//       for (const uri of uris) {
//         let window = browser.windows.find(window => {
//           return window.location === uri;
//         });
//         if (!window) {
//           window = createSyntheticWindow({
//             location: uri,
//             bounds: { left: 0, top: 0, right: 100, bottom: 100 }
//           });
//           state = addSyntheticWindow(state, browser.$id, window);
//         }
//         selection.push(window);
//       }
//       console.log(selection);
//       return state;
//     }
//   }
//   return state;
// };
var unfullscreen = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    var originalWindowBounds = workspace.stage.fullScreen.originalWindowBounds;
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        smooth: true,
        fullScreen: undefined
    });
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        translate: workspace.stage.fullScreen.originalTranslate,
        smooth: true
    });
    return state;
};
var selectAndCenterSyntheticWindow = function (state, window) {
    var workspace = state_1.getSelectedWorkspace(state);
    if (!workspace.stage.container)
        return state;
    var _a = workspace.stage.container.getBoundingClientRect(), width = _a.width, height = _a.height;
    state = centerStage(state, state.selectedWorkspaceId, window.bounds, true, workspace.stage.fullScreen ? workspace.stage.fullScreen.originalTranslate.zoom : true);
    // update translate
    workspace = state_1.getSelectedWorkspace(state);
    if (workspace.stage.fullScreen) {
        state = state_1.updateWorkspaceStage(state, workspace.$id, {
            smooth: true,
            fullScreen: {
                windowId: window.$id,
                originalTranslate: workspace.stage.translate,
                originalWindowBounds: window.bounds
            },
            translate: {
                zoom: 1,
                left: -window.bounds.left,
                top: -window.bounds.top
            }
        });
    }
    state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(window));
    return state;
};
var centerSelectedWorkspace = function (state, smooth) {
    if (smooth === void 0) { smooth = false; }
    var workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
    var innerBounds = state_1.getSyntheticBrowserBounds(aerial_browser_sandbox_1.getSyntheticBrowser(state, workspace.browserId));
    // no windows loaded
    if (innerBounds.left + innerBounds.right + innerBounds.top + innerBounds.bottom === 0) {
        console.warn("Stage mounted before windows have been loaded");
        return state;
    }
    return centerStage(state, workspace.$id, innerBounds, smooth, true);
};
var centerStage = function (state, workspaceId, innerBounds, smooth, zoomOrZoomToFit) {
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    var _a = workspace.stage, container = _a.container, translate = _a.translate;
    if (!container)
        return state;
    var _b = container.getBoundingClientRect(), width = _b.width, height = _b.height;
    var innerSize = aerial_common2_1.getBoundsSize(innerBounds);
    var centered = {
        left: -innerBounds.left + width / 2 - (innerSize.width) / 2,
        top: -innerBounds.top + height / 2 - (innerSize.height) / 2,
    };
    var scale = typeof zoomOrZoomToFit === "boolean" ? Math.min((width - INITIAL_ZOOM_PADDING) / innerSize.width, (height - INITIAL_ZOOM_PADDING) / innerSize.height) : typeof zoomOrZoomToFit === "number" ? zoomOrZoomToFit : translate.zoom;
    return state_1.updateWorkspaceStage(state, workspaceId, {
        smooth: smooth,
        translate: aerial_common2_1.centerTransformZoom(__assign({}, centered, { zoom: 1 }), { left: 0, top: 0, right: width, bottom: height }, scale)
    });
};
var handleWindowSelectionFromAction = function (state, ref, event) {
    var sourceEvent = event.sourceEvent;
    var workspace = state_1.getSelectedWorkspace(state);
    // TODO - may want to allow multi selection once it's confirmed to work on
    // all scenarios.
    // meta key + no items selected should display source of 
    // if (sourceEvent.metaKey && workspace.selectionRefs.length) {
    //   return toggleWorkspaceSelection(state, workspace.$id, ref);
    // } else if(!sourceEvent.metaKey) {
    //   return setWorkspaceSelection(state, workspace.$id, ref);
    // }
    return state_1.setWorkspaceSelection(state, workspace.$id, ref);
};
var normalizeZoom = function (zoom) {
    return (zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom));
};
var windowPaneReducer = function (state, event) {
    switch (event.type) {
        case actions_1.WINDOW_PANE_ROW_CLICKED: {
            return handleWindowSelectionFromAction(state, aerial_common2_1.getStructReference(aerial_browser_sandbox_1.getSyntheticWindow(state, event.windowId)), event);
        }
    }
    return state;
};
var updateWorkspaceStageSmoothing = function (state, workspace) {
    if (!workspace)
        workspace = state_1.getSelectedWorkspace(state);
    if (!workspace.stage.fullScreen && workspace.stage.smooth) {
        return state_1.updateWorkspaceStage(state, workspace.$id, {
            smooth: false
        });
    }
    return state;
};
var setStageZoom = function (state, workspaceId, zoom, smooth) {
    if (smooth === void 0) { smooth = true; }
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    return state_1.updateWorkspaceStage(state, workspace.$id, {
        smooth: smooth,
        translate: aerial_common2_1.centerTransformZoom(workspace.stage.translate, workspace.stage.container.getBoundingClientRect(), lodash_1.clamp(zoom, MIN_ZOOM, MAX_ZOOM), workspace.stage.mousePosition)
    });
};


 ;(function register() { /* react-hot-loader/webpack */ if (process.env.NODE_ENV !== 'production') { if (typeof __REACT_HOT_LOADER__ === 'undefined') { return; } /* eslint-disable camelcase, no-undef */ var webpackExports = typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__ : module.exports; /* eslint-enable camelcase, no-undef */ if (typeof webpackExports === 'function') { __REACT_HOT_LOADER__.register(webpackExports, 'module.exports', "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/reducers/index.ts"); return; } /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) { /* eslint-enable no-restricted-syntax */ if (!Object.prototype.hasOwnProperty.call(webpackExports, key)) { continue; } var namedExport = void 0; try { namedExport = webpackExports[key]; } catch (err) { continue; } __REACT_HOT_LOADER__.register(namedExport, key, "/Users/crcn/Developer/work/tandem/public/packages/tandem-app/src/front-end/reducers/index.ts"); } } })();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ })

})