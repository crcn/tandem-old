"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var paperclip_1 = require("paperclip");
var slim_dom_1 = require("slim-dom");
var shortcuts_1 = require("./shortcuts");
var actions_1 = require("front-end/actions");
var lodash_1 = require("lodash");
/**
 * Types
 */
exports.WORKSPACE = "WORKSPACE";
exports.APPLICATION_STATE = "APPLICATION_STATE";
exports.LIBRARY_COMPONENT = "LIBRARY_COMPONENT";
exports.ARTBOARD = "ARTBOARD";
var ARTBOARD_PADDING = 10;
exports.DEFAULT_ARTBOARD_SIZE = paperclip_1.DEFAULT_PREVIEW_SIZE;
/**
 * Utilities
 */
exports.showWorkspaceTextEditor = function (root, workspaceId) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspaceStage(root, workspaceId, {
        showTextEditor: true
    });
};
exports.updateWorkspaceStage = function (root, workspaceId, stageProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspace(root, workspaceId, {
        stage: __assign({}, workspace.stage, stageProperties)
    });
};
exports.updateWorkspaceTextEditor = function (root, workspaceId, textEditorProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.updateWorkspace(root, workspaceId, {
        textEditor: __assign({}, workspace.textEditor, textEditorProperties)
    });
};
exports.getSyntheticBrowserWorkspace = aerial_common2_1.weakMemo(function (root, browserId) {
    return root.workspaces.find(function (workspace) { return workspace.browserId === browserId; });
});
exports.addWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(workspace.selectionRefs, selection));
};
exports.removeWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(workspace.selectionRefs.filter(function (type, id) { return !selection.find(function (type2, id2) { return id === id2; }); })));
};
/**
 * Utility to ensure that workspace selection items are within the same window object. This prevents users from selecting
 * the _same_ element across different window objects.
 */
var deselectOutOfScopeWorkpaceSelection = function (root, workspaceId, ref) {
    if (ref && ref[0] === slim_dom_1.SlimVMObjectType.ELEMENT) {
        return root;
    }
    var artboard = exports.getNodeArtboard(ref[1], root);
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var updatedSelection = [];
    for (var _i = 0, _a = workspace.selectionRefs; _i < _a.length; _i++) {
        var selection = _a[_i];
        if (slim_dom_1.getNestedObjectById(selection[1], artboard.document)) {
            updatedSelection.push(selection);
        }
    }
    return exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(updatedSelection));
};
exports.structRefExists = function (_a, state) {
    var type = _a[0], id = _a[1];
    if (type === exports.ARTBOARD) {
        return Boolean(exports.getArtboardById(id, state));
    }
    return Boolean(exports.getNodeArtboard(id, state));
};
exports.deselectNotFoundItems = function (root) {
    for (var _i = 0, _a = root.workspaces; _i < _a.length; _i++) {
        var workspace = _a[_i];
        root = exports.updateWorkspace(root, workspace.$id, {
            hoveringRefs: workspace.hoveringRefs.filter(function (ref) { return exports.structRefExists(ref, root); }),
            selectionRefs: workspace.selectionRefs.filter(function (ref) { return exports.structRefExists(ref, root); })
        });
    }
    return root;
};
/**
 * Prevents nodes that have a parent/child relationship from being selected.
 */
// TODO UPDATRE ME
var deselectRelatedWorkspaceSelection = function (root, workspaceId, ref) {
    if (ref && ref[0] === slim_dom_1.SlimVMObjectType.ELEMENT) {
        return root;
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var artboard = exports.getNodeArtboard(ref[1], root);
    var updatedSelection = [];
    for (var _i = 0, _a = workspace.selectionRefs; _i < _a.length; _i++) {
        var selection = _a[_i];
        // if (!syntheticNodeIsRelative(window, ref[1], selection[1])) {
        //   updatedSelection.push(selection);
        // }
    }
    return root;
    // return setWorkspaceSelection(root, workspaceId, ...updatedSelection);
};
// deselect unrelated refs, ensures that selection is not a child of existing one. etc.
var cleanupWorkspaceSelection = function (state, workspaceId) {
    var workspace = exports.getWorkspaceById(state, workspaceId);
    if (workspace.selectionRefs.length > 0) {
        // use _last_ selected element since it's likely the one that was just clicked. Don't want to prevent the 
        // user from doing so
        state = deselectOutOfScopeWorkpaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
        state = deselectRelatedWorkspaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
    }
    return state;
};
exports.toggleWorkspaceSelection = function (root, workspaceId) {
    var selection = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selection[_i - 2] = arguments[_i];
    }
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var newSelection = [];
    var oldSelectionIds = workspace.selectionRefs.map(function (_a) {
        var type = _a[0], id = _a[1];
        return id;
    });
    var toggleSelectionIds = selection.map(function (_a) {
        var type = _a[0], id = _a[1];
        return id;
    });
    for (var _a = 0, _b = workspace.selectionRefs; _a < _b.length; _a++) {
        var ref = _b[_a];
        if (toggleSelectionIds.indexOf(ref[1]) === -1) {
            newSelection.push(ref);
        }
    }
    for (var _c = 0, selection_1 = selection; _c < selection_1.length; _c++) {
        var ref = selection_1[_c];
        if (oldSelectionIds.indexOf(ref[1]) === -1) {
            newSelection.push(ref);
        }
    }
    return cleanupWorkspaceSelection(exports.setWorkspaceSelection.apply(void 0, [root, workspaceId].concat(newSelection)), workspaceId);
};
exports.clearWorkspaceSelection = function (root, workspaceId) {
    return exports.updateWorkspaceStage(exports.updateWorkspace(root, workspaceId, {
        selectionRefs: [],
        hoveringRefs: []
    }), workspaceId, {
        secondarySelection: false
    });
};
exports.setWorkspaceSelection = function (root, workspaceId) {
    var selectionIds = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        selectionIds[_i - 2] = arguments[_i];
    }
    return exports.updateWorkspace(root, workspaceId, {
        selectionRefs: lodash_1.uniq(selectionIds.slice())
    });
};
exports.updateWorkspace = function (root, workspaceId, newProperties) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    return __assign({}, root, { workspaces: aerial_common2_1.arrayReplaceIndex(root.workspaces, root.workspaces.indexOf(workspace), __assign({}, workspace, newProperties)) });
};
exports.createTargetSelector = function (uri, value) { return ({
    uri: uri,
    value: value
}); };
exports.toggleWorkspaceTargetCSSSelector = function (root, workspaceId, uri, selectorText) {
    var workspace = exports.getWorkspaceById(root, workspaceId);
    var cssSelectors = (workspace.targetCSSSelectors || []);
    var index = cssSelectors.findIndex(function (targetSelector) {
        return targetSelector.uri === uri && targetSelector.value == selectorText;
    });
    return exports.updateWorkspace(root, workspaceId, {
        targetCSSSelectors: index === -1 ? cssSelectors.concat([exports.createTargetSelector(uri, selectorText)]) : aerial_common2_1.arraySplice(cssSelectors, index, 1)
    });
};
exports.addWorkspace = function (root, workspace) {
    return __assign({}, root, { workspaces: root.workspaces.concat([workspace]) });
};
// export const filterMatchingTargetSelectors = weakMemo((targetCSSSelectors: TargetSelector[], element: any, document: any) => filterApplicableTargetSelectors(targetCSSSelectors, document).filter((rule) => elementMatches(rule.value, element, document)));
// const filterApplicableTargetSelectors = weakMemo((selectors: TargetSelector[], window: SyntheticWindow): TargetSelector[] => {
//   const map = {};
//   for (const selector of selectors) {
//     map[selector.uri + selector.value] = selector;
//   }
//   const rules = [];
//   const children = getSyntheticWindowChildStructs(window);
//   for (const $id in children) {
//     const child = children[$id] as SyntheticCSSStyleRule;
//     if (child.$type === SYNTHETIC_CSS_STYLE_RULE && child.source && map[child.source.uri + child.selectorText]) {
//       rules.push(map[child.source.uri + child.selectorText]);
//     }
//   }
//   return uniq(rules);
// });
// const getSelectorAffectedWindows = weakMemo((targetCSSSelectors: TargetSelector[], browser: SyntheticBrowser): SyntheticWindow[] => {
//   const affectedWindows: SyntheticWindow[] = [];
//   for (const window of browser.windows) {
//     if (filterApplicableTargetSelectors(targetCSSSelectors, window).length) {
//       affectedWindows.push(window);
//     }
//   }
//   return affectedWindows;
// });
// export const getObjectsWithSameSource = weakMemo((itemId: string, browser: SyntheticBrowser, limitToElementWindow?: boolean): any[] => {
//   const target = getSyntheticNodeById(browser, itemId);
//   const objects = {};
//   const objectsWithSameSource = [];
//   const windows = limitToElementWindow ? [getSyntheticNodeWindow(browser, itemId)] : browser.windows;
//   for (const window of windows) {
//     const windowsObjects = getSyntheticWindowChildStructs(window);
//     for (const $id in windowsObjects) {
//       const child = windowsObjects[$id];
//       if (child.source && target.source && expressionLocationEquals(child.source, target.source)) {
//         objectsWithSameSource.push(child);
//       }
//     }
//   }
//   return objectsWithSameSource;
// });
// export const getSelectorAffectedElements = weakMemo((elementId: string, targetCSSSelectors: TargetSelector[], browser: SyntheticBrowser, limitToElementWindow?: boolean): SyntheticElement[] => {
//   const affectedElements: SyntheticElement[] = [];
//   if (!targetCSSSelectors.length) {
//     affectedElements.push(...getObjectsWithSameSource(elementId, browser, limitToElementWindow));
//   } else {
//     let affectedWindows = targetCSSSelectors.length ? getSelectorAffectedWindows(targetCSSSelectors, browser) : browser.windows;
//     if (limitToElementWindow) {
//       affectedWindows = [getSyntheticNodeWindow(browser, elementId)];
//     }
//     for (const window of affectedWindows) {
//       for (const { value: selectorText } of targetCSSSelectors) {
//         affectedElements.push(...getMatchingElements(window, selectorText));
//       }
//     }
//   }
//   return uniq(affectedElements);
// });
exports.getWorkspaceReference = function (ref, workspace) {
    if (ref[0] === exports.ARTBOARD) {
        return exports.getArtboardById(ref[1], workspace);
    }
    var artboard = exports.getNodeArtboard(ref[1], workspace);
    return artboard && slim_dom_1.getNestedObjectById(ref[1], artboard.document);
};
exports.getSyntheticNodeWorkspace = aerial_common2_1.weakMemo(function (root, nodeId) {
    return exports.getArtboardWorkspace(exports.getNodeArtboard(nodeId, root).$id, root);
});
exports.getBoundedWorkspaceSelection = aerial_common2_1.weakMemo(function (workspace) { return workspace.selectionRefs.map(function (ref) { return exports.getWorkspaceReference(ref, workspace); }).filter(function (item) { return exports.getWorkspaceItemBounds(item, workspace); }); });
exports.getWorkspaceSelectionBounds = aerial_common2_1.weakMemo(function (workspace) { return aerial_common2_1.mergeBounds.apply(void 0, exports.getBoundedWorkspaceSelection(workspace).map(function (boxed) { return exports.getWorkspaceItemBounds(boxed, workspace); })); });
exports.getNodeArtboard = aerial_common2_1.weakMemo(function (nodeId, state) {
    if (state.$type === exports.WORKSPACE) {
        return state.artboards.find(function (artboard) {
            return artboard.document && Boolean(slim_dom_1.getNestedObjectById(nodeId, artboard.document));
        });
    }
    else {
        for (var _i = 0, _a = state.workspaces; _i < _a.length; _i++) {
            var workspace = _a[_i];
            var artboard = exports.getNodeArtboard(nodeId, workspace);
            if (artboard) {
                return artboard;
            }
        }
    }
});
exports.getWorkspaceVMObject = aerial_common2_1.weakMemo(function (nodeId, state) {
    return state.artboards.map(function (artboard) { return slim_dom_1.getNestedObjectById(nodeId, artboard.document); }).find(Boolean);
});
exports.getComputedNodeBounds = aerial_common2_1.weakMemo(function (nodeId, artboard) {
    var info = artboard.computedDOMInfo;
    return info[nodeId] && info[nodeId].bounds;
});
exports.getWorkspaceItemBounds = aerial_common2_1.weakMemo(function (value, workspace) {
    if (!value) {
        return null;
    }
    if (value.$type === exports.ARTBOARD) {
        return value.bounds;
    }
    else {
        var artboard = exports.getNodeArtboard(value.id, workspace);
        return aerial_common2_1.shiftBounds(exports.getComputedNodeBounds(value.id, artboard), artboard.bounds);
    }
});
exports.moveArtboardToBestPosition = function (artboard, state) {
    var size = artboard.bounds ? {
        width: artboard.bounds.right - artboard.bounds.left,
        height: artboard.bounds.bottom - artboard.bounds.top
    } : exports.DEFAULT_ARTBOARD_SIZE;
    var workspace = exports.getSelectedWorkspace(state);
    var bounds = workspace.artboards.length ? exports.getArtboardBounds(workspace) : {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    return __assign({}, artboard, { bounds: {
            left: ARTBOARD_PADDING + bounds.right,
            top: ARTBOARD_PADDING + bounds.top,
            right: ARTBOARD_PADDING + bounds.right + size.width,
            bottom: ARTBOARD_PADDING + bounds.top + size.height
        } });
};
exports.roundArtboardBounds = function (artboardId, state) {
    var bounds = exports.getArtboardById(artboardId, state).bounds;
    return exports.updateArtboard(state, artboardId, {
        bounds: aerial_common2_1.roundBounds(bounds)
    });
};
exports.getArtboardPreviewUri = function (artboard, state) { return state.apiHost + ("/components/" + artboard.componentId + "/preview") + (artboard.previewName ? "/" + artboard.previewName : ""); };
exports.getStageZoom = function (stage) { return exports.getStageTranslate(stage).zoom; };
exports.getStageTranslate = function (stage) { return stage.translate; };
exports.getWorkspaceById = function (state, id) { return state.workspaces.find(function (workspace) { return workspace.$id === id; }); };
exports.getSelectedWorkspace = function (state) { return state.selectedWorkspaceId && exports.getWorkspaceById(state, state.selectedWorkspaceId); };
exports.getAvailableComponent = function (componentId, workspace) { return workspace.availableComponents.find(function (component) { return component.$id === componentId; }); };
exports.getWorkspaceLastSelectionOwnerArtboard = function (state, workspaceId) {
    if (workspaceId === void 0) { workspaceId = state.selectedWorkspaceId; }
    var workspace = exports.getWorkspaceById(state, workspaceId);
    if (workspace.selectionRefs.length === 0) {
        return null;
    }
    var lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];
    return lastSelectionRef[0] === exports.ARTBOARD ? exports.getArtboardById(lastSelectionRef[1], workspace) : exports.getNodeArtboard(lastSelectionRef[1], workspace);
};
exports.getArtboardById = aerial_common2_1.weakMemo(function (artboardId, state) {
    var workspace;
    if (state.$type === exports.APPLICATION_STATE) {
        var appState = state;
        workspace = exports.getArtboardWorkspace(artboardId, appState);
        if (!workspace) {
            return null;
        }
    }
    else {
        workspace = state;
    }
    return workspace.artboards.find(function (artboard) { return artboard.$id === artboardId; });
});
exports.getArtboardByInfo = function (componentId, previewName, state) {
    for (var _i = 0, _a = state.workspaces; _i < _a.length; _i++) {
        var workspace = _a[_i];
        for (var _b = 0, _c = workspace.artboards; _b < _c.length; _b++) {
            var artboard = _c[_b];
            if (artboard.componentId === componentId && (artboard.previewName === previewName)) {
                return artboard;
            }
        }
    }
    return null;
};
exports.getArtboardsByInfo = function (componentId, previewName, state) {
    var artboards = [];
    for (var _i = 0, _a = state.workspaces; _i < _a.length; _i++) {
        var workspace = _a[_i];
        for (var _b = 0, _c = workspace.artboards; _b < _c.length; _b++) {
            var artboard = _c[_b];
            if (artboard.componentId === componentId && (artboard.previewName === previewName)) {
                artboards.push(artboard);
            }
        }
    }
    return artboards;
};
exports.getArtboardDocumentBody = function (artboard) { return exports.getDocumentBody(artboard.document); };
exports.getDocumentBody = function (document) { return document.childNodes[0].childNodes[0]; };
exports.getDocumentBodyPreview = function (document) { return exports.getDocumentBody(document); };
exports.getArtboardDocumentBodyPath = function (artboard) { return [0, 0]; };
exports.getArtboardBounds = aerial_common2_1.weakMemo(function (workspace) { return aerial_common2_1.mergeBounds.apply(void 0, workspace.artboards.map(function (artboard) { return artboard.bounds; })); });
exports.getArtboardWorkspace = aerial_common2_1.weakMemo(function (artboardId, state) {
    var appState = state;
    for (var _i = 0, _a = appState.workspaces; _i < _a.length; _i++) {
        var workspace = _a[_i];
        var artboard = exports.getArtboardById(artboardId, workspace);
        if (artboard)
            return workspace;
    }
    return null;
});
exports.updateArtboard = function (state, artboardId, properties) {
    var workspace = exports.getArtboardWorkspace(artboardId, state);
    var artboard = exports.getArtboardById(artboardId, workspace);
    return exports.updateWorkspace(state, workspace.$id, {
        artboards: aerial_common2_1.arrayReplaceIndex(workspace.artboards, workspace.artboards.indexOf(artboard), __assign({}, artboard, properties))
    });
};
exports.updateArtboardSize = function (state, artboardId, width, height) {
    var artboard = exports.getArtboardById(artboardId, state);
    return exports.updateArtboard(state, artboardId, {
        bounds: {
            left: artboard.bounds.left,
            top: artboard.bounds.top,
            right: artboard.bounds.left + width,
            bottom: artboard.bounds.top + height
        }
    });
};
exports.removeArtboard = function (artboardId, state) {
    var workspace = exports.getArtboardWorkspace(artboardId, state);
    var artboard = exports.getArtboardById(artboardId, workspace);
    return exports.updateWorkspace(state, workspace.$id, {
        artboards: aerial_common2_1.arrayRemoveItem(workspace.artboards, artboard)
    });
};
/**
 * Factories
 */
exports.createWorkspace = aerial_common2_1.createStructFactory(exports.WORKSPACE, {
    // null to denote style attribute
    targetCSSSelectors: [],
    artboards: [],
    stage: {
        panning: false,
        secondarySelection: false,
        translate: { left: 0, top: 0, zoom: 1 },
        showTextEditor: false,
        showLeftGutter: true,
        showRightGutter: true,
    },
    textEditor: {},
    selectionRefs: [],
    hoveringRefs: [],
    draggingRefs: [],
    library: [],
    availableComponents: []
});
exports.createApplicationState = aerial_common2_1.createStructFactory(exports.APPLICATION_STATE, {
    workspaces: [],
    shortcuts: [
        shortcuts_1.createKeyboardShortcut("backspace", actions_1.deleteShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+b", actions_1.toggleLeftGutterPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+b", actions_1.toggleLeftGutterPressed()),
        shortcuts_1.createKeyboardShortcut("meta+/", actions_1.toggleRightGutterPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+/", actions_1.toggleRightGutterPressed()),
        shortcuts_1.createKeyboardShortcut("meta+e", actions_1.toggleTextEditorPressed()),
        shortcuts_1.createKeyboardShortcut("meta+f", actions_1.fullScreenShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+f", actions_1.fullScreenShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+=", actions_1.zoomInShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+-", actions_1.zoomOutShortcutPressed()),
        // ignore for now since project is scoped to Paperclip only. Windows
        // should be added in via the components pane.
        // createKeyboardShortcut("meta+t", openNewWindowShortcutPressed()),
        // createKeyboardShortcut("ctrl+t", openNewWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("meta+enter", actions_1.cloneWindowShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("escape", actions_1.escapeShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+shift+]", actions_1.nextArtboardShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+shift+[", actions_1.prevArtboardShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("ctrl+meta+t", actions_1.toggleToolsShortcutPressed()),
        shortcuts_1.createKeyboardShortcut("up", { type: actions_1.UP_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("up", { type: actions_1.UP_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("down", { type: actions_1.DOWN_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("down", { type: actions_1.DOWN_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("left", { type: actions_1.LEFT_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("left", { type: actions_1.LEFT_KEY_UP }, { keyup: true }),
        shortcuts_1.createKeyboardShortcut("right", { type: actions_1.RIGHT_KEY_DOWN }, { keyup: false }),
        shortcuts_1.createKeyboardShortcut("right", { type: actions_1.RIGHT_KEY_UP }, { keyup: true }),
    ]
});
exports.createArtboard = aerial_common2_1.createStructFactory(exports.ARTBOARD, {
    loading: true,
    scrollPosition: {
        left: 0,
        top: 0
    }
});
exports.selectWorkspace = function (state, selectedWorkspaceId) { return (__assign({}, state, { selectedWorkspaceId: selectedWorkspaceId })); };
exports.getScaledMouseStagePosition = function (state, event) {
    var _a = event.sourceEvent, pageX = _a.pageX, pageY = _a.pageY, nativeEvent = _a.nativeEvent;
    var workspace = exports.getSelectedWorkspace(state);
    var stage = workspace.stage;
    var translate = exports.getStageTranslate(stage);
    var scaledPageX = ((pageX - translate.left) / translate.zoom);
    var scaledPageY = ((pageY - translate.top) / translate.zoom);
    return { left: scaledPageX, top: scaledPageY };
};
exports.getStageToolMouseNodeTargetReference = function (state, event) {
    var workspace = exports.getSelectedWorkspace(state);
    var stage = workspace.stage;
    var translate = exports.getStageTranslate(stage);
    var _a = exports.getScaledMouseStagePosition(state, event), scaledPageX = _a.left, scaledPageY = _a.top;
    var artboard = stage.fullScreen ? exports.getArtboardById(stage.fullScreen.artboardId, workspace) : workspace.artboards.find(function (artboard) { return (aerial_common2_1.pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, artboard.bounds)); });
    if (!artboard)
        return null;
    var mouseX = scaledPageX - artboard.bounds.left;
    var mouseY = scaledPageY - artboard.bounds.top;
    var computedInfo = artboard.computedDOMInfo || {};
    var intersectingBounds = [];
    var intersectingBoundsMap = new Map();
    for (var $id in computedInfo) {
        var bounds = computedInfo[$id].bounds;
        if (aerial_common2_1.pointIntersectsBounds({ left: mouseX, top: mouseY }, bounds)) {
            intersectingBounds.push(bounds);
            intersectingBoundsMap.set(bounds, $id);
        }
    }
    if (!intersectingBounds.length)
        return null;
    var smallestBounds = aerial_common2_1.getSmallestBounds.apply(void 0, intersectingBounds);
    return [slim_dom_1.SlimVMObjectType.ELEMENT, intersectingBoundsMap.get(smallestBounds)];
};
exports.serializeApplicationState = function (_a) {
    var workspaces = _a.workspaces, selectedWorkspaceId = _a.selectedWorkspaceId;
    return ({
        workspaces: workspaces.map(exports.serializeWorkspace),
        selectedWorkspaceId: selectedWorkspaceId
    });
};
exports.serializeWorkspace = function (workspace) { return ({
    $id: workspace.$id,
    $type: workspace.$type,
    targetCSSSelectors: workspace.targetCSSSelectors,
    selectionRefs: [],
    artboards: workspace.artboards.map(serializeArtboard),
    stage: serializeStage(workspace.stage),
    textEditor: workspace.textEditor,
    library: [],
    availableComponents: []
}); };
var serializeArtboard = function (_a) {
    var $id = _a.$id, $type = _a.$type, componentId = _a.componentId, previewName = _a.previewName, bounds = _a.bounds;
    return ({
        $id: $id,
        $type: $type,
        componentId: componentId,
        previewName: previewName,
        bounds: bounds,
        scrollPosition: {
            left: 0,
            top: 0
        }
    });
};
var serializeStage = function (_a) {
    var showTextEditor = _a.showTextEditor, showRightGutter = _a.showRightGutter, showLeftGutter = _a.showLeftGutter, showTools = _a.showTools, translate = _a.translate, fullScreen = _a.fullScreen;
    return ({
        panning: false,
        translate: translate,
        fullScreen: fullScreen,
        showTextEditor: showTextEditor,
        showRightGutter: showRightGutter,
        showLeftGutter: showLeftGutter,
        showTools: true
    });
};
exports.getArtboardLabel = function (artboard) { return artboard.componentId + (artboard.previewName ? " - " + artboard.previewName : ""); };
__export(require("./shortcuts"));
__export(require("./api"));
__export(require("./dnd"));
//# sourceMappingURL=index.js.map