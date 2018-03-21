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
var slim_dom_1 = __webpack_require__("../slim-dom/index.js");
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
            break;
        }
        case actions_1.TREE_NODE_LABEL_CLICKED: {
            var node = event.node;
            state = state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                selectedFileId: node.$id
            });
            break;
        }
        case actions_1.TOGGLE_TARGET_CSS_TARGET_SELECTOR_CLICKED: {
            var _a = event, itemId = _a.itemId, artboardId = _a.artboardId;
            var artboard = state_1.getArtboardById(artboardId, state);
            var item = slim_dom_1.getNestedObjectById(itemId, artboard.document);
            var workspace = state_1.getArtboardWorkspace(artboard.$id, state);
            ;
            state = state_1.toggleWorkspaceTargetCSSSelector(state, workspace.$id, item.source.uri, item.selectorText);
            break;
        }
    }
    // state = canvasReducer(state, event);
    // state = syntheticBrowserReducer(state, event);
    state = aerial_browser_sandbox_1.syntheticBrowserReducer(state, event);
    state = artboardReducer(state, event);
    state = stageReducer(state, event);
    state = artboardPaneReducer(state, event);
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
        case actions_1.PREV_ARTBOARD_SHORTCUT_PRESSED: {
            return state;
        }
        case actions_1.FULL_SCREEN_TARGET_DELETED: {
            return unfullscreen(state);
        }
        case actions_1.FULL_SCREEN_SHORTCUT_PRESSED: {
            var workspace = state_1.getSelectedWorkspace(state);
            var selection = workspace.selectionRefs[0];
            var artboardId = selection ? selection[0] === state_1.ARTBOARD ? selection[1] : state_1.getNodeArtboard(selection[1], state) && state_1.getNodeArtboard(selection[1], state).$id : null;
            if (artboardId && !workspace.stage.fullScreen) {
                var artboard = state_1.getArtboardById(artboardId, state);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    smooth: true,
                    fullScreen: {
                        artboardId: artboardId,
                        originalTranslate: workspace.stage.translate,
                        originalArtboardBounds: artboard.bounds
                    },
                    translate: {
                        zoom: 1,
                        left: -artboard.bounds.left,
                        top: -artboard.bounds.top
                    }
                });
                var updatedWorkspace = state_1.getSelectedWorkspace(state);
                state = state_1.updateArtboard(state, artboardId, {
                    bounds: {
                        left: artboard.bounds.left,
                        top: artboard.bounds.top,
                        right: artboard.bounds.left + workspace.stage.container.getBoundingClientRect().width,
                        bottom: artboard.bounds.top + workspace.stage.container.getBoundingClientRect().height
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
        case actions_1.RESIZER_MOVED: {
            var _c = event, point = _c.point, workspaceId = _c.workspaceId, newPoint = _c.point;
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: true
            });
            var translate = state_1.getStageTranslate(workspace.stage);
            var selectionBounds = state_1.getWorkspaceSelectionBounds(workspace);
            for (var _i = 0, _d = state_1.getBoundedWorkspaceSelection(workspace); _i < _d.length; _i++) {
                var item = _d[_i];
                var itemBounds = state_1.getWorkspaceItemBounds(item, workspace);
                // skip moving window if in full screen mode
                if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === item.$id) {
                    break;
                }
                var newBounds = aerial_common2_1.scaleInnerBounds(itemBounds, selectionBounds, aerial_common2_1.moveBounds(selectionBounds, newPoint));
                if (item.$type === state_1.ARTBOARD) {
                    state = state_1.updateArtboard(state, item.$id, { bounds: newBounds });
                }
            }
            return state;
        }
        case actions_1.RESIZER_PATH_MOUSE_MOVED: {
            var _e = event, workspaceId = _e.workspaceId, anchor = _e.anchor, originalBounds = _e.originalBounds, newBounds = _e.newBounds, sourceEvent = _e.sourceEvent;
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                movingOrResizing: true
            });
            // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
            var currentBounds = state_1.getWorkspaceSelectionBounds(workspace);
            var keepAspectRatio = sourceEvent.shiftKey;
            var keepCenter = sourceEvent.altKey;
            if (keepCenter) {
                // newBounds = keepBoundsCenter(newBounds, bounds, anchor);
            }
            if (keepAspectRatio) {
                newBounds = aerial_common2_1.keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
            }
            for (var _f = 0, _g = state_1.getBoundedWorkspaceSelection(workspace); _f < _g.length; _f++) {
                var item = _g[_f];
                var innerBounds = state_1.getSyntheticBrowserItemBounds(state, item);
                var scaledBounds = aerial_common2_1.scaleInnerBounds(currentBounds, currentBounds, newBounds);
                if (item.$type === state_1.ARTBOARD) {
                    state = state_1.updateArtboard(state, item.$id, {
                        bounds: aerial_common2_1.scaleInnerBounds(innerBounds, currentBounds, newBounds)
                    });
                }
            }
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
        case actions_1.ARTBOARD_FOCUSED: {
            var artboardId = event.artboardId;
            return selectAndCenterArtboard(state, state_1.getArtboardById(artboardId, state));
        }
        case aerial_browser_sandbox_1.SYNTHETIC_WINDOW_PROXY_OPENED: {
            var _h = event, instance = _h.instance, isNew = _h.isNew;
            // if a window instance exists in the store, then it's already visible on stage -- could
            // have been loaded from a saved state.
            if (!isNew) {
                return state;
            }
            // return selectAndCenterArtboard(state, instance.struct);
            return state;
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_LEAVE: {
            var sourceEvent = event.sourceEvent;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_ENTER: {
            var _j = event, artboardId = _j.artboardId, ruleId = _j.ruleId;
            var artboard = state_1.getArtboardById(artboardId, state);
            // TODO
            return state;
            // const { selectorText }: SEnvCSSStyleRuleInterface = getNestedObjectById(ruleId, artboard.document);
            // return updateWorkspace(state, state.selectedWorkspaceId, {
            //   hoveringRefs: getMatchingElements(artboard, selectorText).map((element) => [
            //     element.$type,
            //     element.$id
            //   ]) as [[string, string]]
            // });
        }
        case actions_1.CSS_DECLARATION_TITLE_MOUSE_LEAVE: {
            var _k = event, artboardId = _k.artboardId, ruleId = _k.ruleId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: []
            });
        }
        case actions_1.BREADCRUMB_ITEM_CLICKED: {
            var _l = event, artboardId = _l.artboardId, nodeId = _l.nodeId;
            var artboard = state_1.getArtboardById(artboardId, state);
            var node = slim_dom_1.getNestedObjectById(nodeId, artboard.document);
            var workspace = state_1.getArtboardWorkspace(artboard.$id, state);
            return state_1.setWorkspaceSelection(state, workspace.$id, [node.type, node.id]);
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_ENTER: {
            var _m = event, artboardId = _m.artboardId, nodeId = _m.nodeId;
            return state_1.updateWorkspace(state, state.selectedWorkspaceId, {
                hoveringRefs: [[aerial_browser_sandbox_1.SYNTHETIC_ELEMENT, nodeId]]
            });
        }
        case actions_1.BREADCRUMB_ITEM_MOUSE_LEAVE: {
            var _o = event, artboardId = _o.artboardId, nodeId = _o.nodeId;
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
                var _p = element.getBoundingClientRect() || {}, _q = _p.width, width = _q === void 0 ? 400 : _q, _r = _p.height, height = _r === void 0 ? 300 : _r;
                var workspaceId = state.selectedWorkspaceId;
                var workspace = state_1.getSelectedWorkspace(state);
                state = state_1.updateWorkspaceStage(state, workspaceId, { container: element });
                // do not center if in full screen mode
                if (workspace.stage.fullScreen) {
                    return state_1.updateArtboardSize(state, workspace.stage.fullScreen.artboardId, width, height);
                }
                return centerSelectedWorkspace(state);
            }
            ;
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_START: {
            var artboardId = event.artboardId;
            var workspace = state_1.getArtboardWorkspace(artboardId, state);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: true });
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_PAN_END: {
            var artboardId = event.artboardId;
            var workspace = state_1.getArtboardWorkspace(artboardId, state);
            return state_1.updateWorkspaceStage(state, workspace.$id, { panning: false });
        }
        case actions_1.STAGE_MOUSE_MOVED:
            {
                var _s = event.sourceEvent, pageX = _s.pageX, pageY = _s.pageY;
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
                state = handleArtboardSelectionFromAction(state, targetRef, event);
                state = state_1.updateWorkspaceStage(state, workspace.$id, {
                    secondarySelection: false
                });
                return state;
            }
            return state;
        }
        case actions_1.STAGE_TOOL_OVERLAY_MOUSE_DOUBLE_CLICKED: {
            var _t = event, sourceEvent = _t.sourceEvent, artboardId = _t.artboardId;
            var workspace = state_1.getArtboardWorkspace(artboardId, state);
            var targetRef = state_1.getStageToolMouseNodeTargetReference(state, event);
            if (!targetRef)
                return state;
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, targetRef);
            return state;
        }
        case actions_1.ARTBOARD_SELECTION_SHIFTED: {
            var artboardId = event.artboardId;
            return selectAndCenterArtboard(state, state_1.getArtboardById(artboardId, state));
        }
        case actions_1.SELECTOR_DOUBLE_CLICKED: {
            var _u = event, sourceEvent = _u.sourceEvent, item = _u.item;
            var workspace = state_1.getSyntheticNodeWorkspace(state, item.$id);
            state = state_1.updateWorkspaceStage(state, workspace.$id, {
                secondarySelection: true
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(item));
            return state;
        }
        case actions_1.ARTBOARD_SCROLL: {
            var _v = event, artboardId = _v.artboardId, scrollPosition = _v.scrollPosition;
            return state_1.updateArtboard(state, artboardId, {
                scrollPosition: scrollPosition
            });
        }
        case actions_1.WORKSPACE_DELETION_SELECTED: {
            var workspaceId = event.workspaceId;
            state = state_1.clearWorkspaceSelection(state, workspaceId);
            return state;
        }
        case actions_1.STAGE_TOOL_ARTBOARD_TITLE_CLICKED: {
            state = updateWorkspaceStageSmoothing(state);
            return handleArtboardSelectionFromAction(state, aerial_common2_1.getStructReference(state_1.getArtboardById(event.artboardId, state)), event);
        }
        case actions_1.STAGE_TOOL_WINDOW_BACKGROUND_CLICKED: {
            var workspace = state_1.getSelectedWorkspace(state);
            return state_1.clearWorkspaceSelection(state, workspace.$id);
        }
    }
    return state;
};
var unfullscreen = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = state_1.getWorkspaceById(state, workspaceId);
    var _a = workspace.stage.fullScreen, originalArtboardBounds = _a.originalArtboardBounds, artboardId = _a.artboardId;
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        smooth: true,
        fullScreen: undefined
    });
    state = state_1.updateWorkspaceStage(state, workspace.$id, {
        translate: workspace.stage.fullScreen.originalTranslate,
        smooth: true
    });
    state = state_1.updateArtboard(state, artboardId, {
        bounds: originalArtboardBounds
    });
    return state;
};
var selectAndCenterArtboard = function (state, artboard) {
    var workspace = state_1.getSelectedWorkspace(state);
    if (!workspace.stage.container)
        return state;
    var _a = workspace.stage.container.getBoundingClientRect(), width = _a.width, height = _a.height;
    state = centerStage(state, state.selectedWorkspaceId, artboard.bounds, true, workspace.stage.fullScreen ? workspace.stage.fullScreen.originalTranslate.zoom : true);
    // update translate
    workspace = state_1.getSelectedWorkspace(state);
    if (workspace.stage.fullScreen) {
        state = state_1.updateWorkspaceStage(state, workspace.$id, {
            smooth: true,
            fullScreen: {
                artboardId: artboard.$id,
                originalTranslate: workspace.stage.translate,
                originalArtboardBounds: artboard.bounds
            },
            translate: {
                zoom: 1,
                left: -artboard.bounds.left,
                top: -artboard.bounds.top
            }
        });
    }
    state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(artboard));
    return state;
};
var artboardReducer = function (state, event) {
    switch (event.type) {
        case actions_1.ARTBOARD_LOADED: {
            var _a = event, artboardId = _a.artboardId, dependencyUris = _a.dependencyUris, document_1 = _a.document, mount = _a.mount;
            console.log(slim_dom_1.getDocumentChecksum(document_1));
            return state_1.updateArtboard(state, artboardId, {
                dependencyUris: dependencyUris,
                document: document_1,
                mount: mount,
                checksum: slim_dom_1.getDocumentChecksum(document_1)
            });
        }
        case actions_1.ARTBOARD_RENDERED: {
            var _b = event, artboardId = _b.artboardId, nativeNodeMap = _b.nativeNodeMap;
            return state_1.updateArtboard(state, artboardId, {
                nativeNodeMap: nativeNodeMap
            });
        }
        case actions_1.STAGE_RESIZED: {
            var _c = event, width = _c.width, height = _c.height;
            return resizeFullScreenArtboard(state, width, height);
        }
        case aerial_common2_1.REMOVED: {
            var _d = event, itemId = _d.itemId, itemType = _d.itemType;
            if (itemType === state_1.ARTBOARD) {
                state = state_1.removeArtboard(itemId, state);
            }
            return state;
        }
        case actions_1.ARTBOARD_DOM_INFO_COMPUTED: {
            var _e = event, artboardId = _e.artboardId, computedInfo = _e.computedInfo;
            return state_1.updateArtboard(state, artboardId, {
                computedDOMInfo: computedInfo
            });
        }
        case actions_1.ARTBOARD_CREATED: {
            var artboard = event.artboard;
            if (!artboard.bounds) {
                artboard = state_1.moveArtboardToBestPosition(artboard, state);
            }
            var workspace = state_1.getSelectedWorkspace(state);
            state = state_1.updateWorkspace(state, workspace.$id, {
                artboards: workspace.artboards.concat([artboard])
            });
            state = state_1.setWorkspaceSelection(state, workspace.$id, aerial_common2_1.getStructReference(artboard));
            return state;
        }
    }
    return state;
};
var centerSelectedWorkspace = function (state, smooth) {
    if (smooth === void 0) { smooth = false; }
    var workspace = state_1.getWorkspaceById(state, state.selectedWorkspaceId);
    var innerBounds = state_1.getArtboardBounds(workspace);
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
var handleArtboardSelectionFromAction = function (state, ref, event) {
    var sourceEvent = event.sourceEvent;
    var workspace = state_1.getSelectedWorkspace(state);
    return state_1.setWorkspaceSelection(state, workspace.$id, ref);
};
var resizeFullScreenArtboard = function (state, width, height) {
    var workspace = state_1.getSelectedWorkspace(state);
    if (workspace.stage.fullScreen && workspace.stage.container) {
        // TODO - do not all getBoundingClientRect here. Dimensions need to be 
        return state_1.updateArtboardSize(state, workspace.stage.fullScreen.artboardId, width, height);
    }
    return state;
};
var normalizeZoom = function (zoom) {
    return (zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom));
};
var artboardPaneReducer = function (state, event) {
    switch (event.type) {
        case actions_1.ARTBOARD_PANE_ROW_CLICKED: {
            var artboardId = event.artboardId;
            return selectAndCenterArtboard(state, state_1.getArtboardById(artboardId, state));
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