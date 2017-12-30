import {
  Bounds,
  Bounded,
  Action,
  Struct,
  shiftBounds,
  zoomBounds,
  TreeNode,
  weakMemo,
  Translate,
  mergeBounds,
  filterBounded,
  getSmallestBounds,
  TargetSelector,
  ImmutableArray, 
  arrayRemoveItem,
  Point,
  serializableKeys,
  serializableKeysFactory,
  StructReference,
  arrayReplaceIndex,
  arraySplice,
  ImmutableObject,
  getStructReference,
  serialize,
  ExpressionPosition,
  pointIntersectsBounds,
  createStructFactory,
  getReferenceString,
  roundBounds,
  BaseApplicationState,
  createImmutableArray,
  createImmutableObject,
  ImmutableArrayIdentity,
  ImmutableObjectIdentity,
  expressionLocationEquals,
  createImmutableStructFactory,
} from "aerial-common2";
import { DEFAULT_PREVIEW_SIZE } from "paperclip";

import { SlimElement, SlimBaseNode, SlimParentNode, SlimCSSStyleDeclaration, flattenObjects, ComputedDOMInfo, DOMNodeMap, getNestedObjectById, SlimWindow, SlimVMObjectType, NativeObjectMap } from "slim-dom";

import {
 AvailableComponent
} from "./api";

import { DNDState } from "./dnd";

import { StageToolOverlayMouseMoved, StageToolOverlayClicked } from "../actions";
import { Shortcut, ShortcutServiceState, createKeyboardShortcut } from "./shortcuts";
import { 
  zoomInShortcutPressed,
  escapeShortcutPressed,
  deleteShortcutPressed,
  zoomOutShortcutPressed,
  toggleTextEditorPressed,
  toggleLeftGutterPressed, 
  toggleRightGutterPressed, 
  fullScreenShortcutPressed,
  nextArtboardShortcutPressed,
  prevArtboardShortcutPressed,
  toggleToolsShortcutPressed,
  cloneWindowShortcutPressed,
  LEFT_KEY_DOWN,
  LEFT_KEY_UP,
  RIGHT_KEY_DOWN,
  RIGHT_KEY_UP,
  UP_KEY_DOWN,
  UP_KEY_UP,
  DOWN_KEY_DOWN,
  DOWN_KEY_UP,
  openNewWindowShortcutPressed,
} from "front-end/actions";

import {
  uniq,
  difference,
  differenceWith
} from "lodash";

/**
 * Types
 */

export const WORKSPACE         = "WORKSPACE";
export const APPLICATION_STATE = "APPLICATION_STATE";
export const LIBRARY_COMPONENT = "LIBRARY_COMPONENT";
export const ARTBOARD = "ARTBOARD";

const ARTBOARD_PADDING = 10;

export const DEFAULT_ARTBOARD_SIZE = DEFAULT_PREVIEW_SIZE;

export type Stage = {
  secondarySelection?: boolean;
  fullScreen?: {
    artboardId: string,
    originalTranslate: Translate;
    originalArtboardBounds: Bounds,
  },
  showTools?: boolean;
  panning: boolean;
  movingOrResizing?: boolean;
  mousePosition?: Point;
  container?: HTMLDivElement;
  smooth?: boolean;
  backgroundColor?: string;
  translate: Translate;
  cursor?: string;
  showTextEditor?: boolean;
  showLeftGutter?: boolean;
  showRightGutter?: boolean;
};

export type TextEditor = {
  cursorPosition?: ExpressionPosition;
};

// library from the project manifest.json file. Provides
// a set of re-usable items that can be used in the codebase
export type LibraryItem = {

  // display name of the library item
  name: string;
  icon?: string;

  // deterministic hash generated usually by file path to help
  // file writer (when library item is dropped to the stage) identify the origin of the library item. 
  hash: string;
};

export type Artboard = {
  loading?: boolean;
  scrollPosition: Point;
  dependencyUris?: string[];
  computedDOMInfo?: ComputedDOMInfo;
  componentId: string;
  previewName: string;
  originalDocument?: SlimParentNode;
  checksum?: string;
  mount?: HTMLIFrameElement;
  nativeObjectMap?: NativeObjectMap;
} & SlimWindow & Struct;

export type Workspace = {
  uncaughtError?: {
    message: string
  };
  targetCSSSelectors: TargetSelector[];
  selectionRefs: StructReference[]; // $type:$id;
  browserId: string;
  hoveringRefs: StructReference[];
  selectedFileId?: string;
  stage: Stage;
  textEditor: TextEditor;
  library: LibraryItem[];
  artboards: Artboard[];
  availableComponents: AvailableComponent[];
} & DNDState & Struct;

export type ApplicationState = {
  workspaces: Workspace[];
  storageNamespace: string;
  selectedWorkspaceId?: string;
  element: HTMLElement;
  apiHost: string;
  textEditorHost: string;
} & BaseApplicationState &  ShortcutServiceState & Struct;

/**
 * Utilities
 */


export const showWorkspaceTextEditor = (root: ApplicationState, workspaceId: string): ApplicationState => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateWorkspaceStage(root, workspaceId, {
    showTextEditor: true
  });
};

export const updateWorkspaceStage = (root: ApplicationState, workspaceId: string, stageProperties: Partial<Stage>): ApplicationState => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateWorkspace(root, workspaceId, {
    stage: {
      ...workspace.stage,
      ...stageProperties
    }
  });
};

export const updateWorkspaceTextEditor = (root: ApplicationState, workspaceId: string, textEditorProperties: Partial<TextEditor>): ApplicationState => {
  const workspace = getWorkspaceById(root, workspaceId);
  return updateWorkspace(root, workspaceId, {
    textEditor: {
      ...workspace.textEditor,
      ...textEditorProperties
    }
  });
};

export const getSyntheticBrowserWorkspace = weakMemo((root: ApplicationState, browserId: string) => {
  return root.workspaces.find(workspace => workspace.browserId === browserId);
});

export const addWorkspaceSelection = (root: ApplicationState, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...workspace.selectionRefs, ...selection);
};

export const removeWorkspaceSelection = (root: ApplicationState, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return setWorkspaceSelection(root, workspaceId, ...workspace.selectionRefs.filter((type, id) => !selection.find((type2, id2) => id === id2)));
}

/**
 * Utility to ensure that workspace selection items are within the same window object. This prevents users from selecting
 * the _same_ element across different window objects. 
 */

const deselectOutOfScopeWorkpaceSelection = (root: ApplicationState, workspaceId: string, ref: StructReference) => {
  
  if (ref && ref[0] === SlimVMObjectType.ELEMENT) {
    return root;
  }

  const artboard = getNodeArtboard(ref[1], root);

  const workspace = getWorkspaceById(root, workspaceId);
  const updatedSelection: StructReference[] = [];

  
  for (const selection of workspace.selectionRefs)   {
    if (getNestedObjectById(selection[1], artboard.document)) {
      updatedSelection.push(selection);
    }
  }

  return setWorkspaceSelection(root, workspaceId, ...updatedSelection);
};

export const structRefExists = ([type, id]: StructReference, state: ApplicationState) => {
  if (type === ARTBOARD) {
    return Boolean(getArtboardById(id, state));
  }
  return Boolean(getNodeArtboard(id, state))
}

export const deselectNotFoundItems = (root: ApplicationState) => {
  for (const workspace of root.workspaces) {
    root = updateWorkspace(root, workspace.$id, {
      hoveringRefs: workspace.hoveringRefs.filter(ref => structRefExists(ref, root)),
      selectionRefs: workspace.selectionRefs.filter(ref => structRefExists(ref, root))
    });
  }
  return root;
}

/**
 * Prevents nodes that have a parent/child relationship from being selected.
 */

 // TODO UPDATRE ME
const deselectRelatedWorkspaceSelection = (root: ApplicationState, workspaceId: string, ref: StructReference) => {
  
  if (ref && ref[0] === SlimVMObjectType.ELEMENT) {
    return root;
  }

  const workspace = getWorkspaceById(root, workspaceId);
  const artboard = getNodeArtboard(ref[1], root);
  const updatedSelection: StructReference[] = [];

  for (const selection of workspace.selectionRefs)   {
    // if (!syntheticNodeIsRelative(window, ref[1], selection[1])) {
    //   updatedSelection.push(selection);
    // }
  }

  return root;
  // return setWorkspaceSelection(root, workspaceId, ...updatedSelection);
};

// deselect unrelated refs, ensures that selection is not a child of existing one. etc.
const cleanupWorkspaceSelection = (state: ApplicationState, workspaceId: string) => {
  const workspace = getWorkspaceById(state, workspaceId);
  
  if (workspace.selectionRefs.length > 0) {

    // use _last_ selected element since it's likely the one that was just clicked. Don't want to prevent the 
    // user from doing so
    state = deselectOutOfScopeWorkpaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
    state = deselectRelatedWorkspaceSelection(state, workspaceId, workspace.selectionRefs[workspace.selectionRefs.length - 1]);
  }

  return state;
}

export const toggleWorkspaceSelection = (root: ApplicationState, workspaceId: string, ...selection: StructReference[]) => {
  const workspace = getWorkspaceById(root, workspaceId);
  const newSelection = [];
  const oldSelectionIds = workspace.selectionRefs.map(([type, id]) => id)
  const toggleSelectionIds = selection.map(([type, id]) => id);
  for (const ref of workspace.selectionRefs) {
    if (toggleSelectionIds.indexOf(ref[1]) === -1) {
      newSelection.push(ref);
    }
  }
  for (const ref of selection) {
    if (oldSelectionIds.indexOf(ref[1]) === -1) {
      newSelection.push(ref);
    }
  }

  return cleanupWorkspaceSelection(setWorkspaceSelection(root, workspaceId, ...newSelection), workspaceId);
};

export const clearWorkspaceSelection = (root: ApplicationState, workspaceId: string) => {
  return updateWorkspaceStage(updateWorkspace(root, workspaceId, {
    selectionRefs: [],
    hoveringRefs: []
  }), workspaceId, {
    secondarySelection: false
  });
};

export const setWorkspaceSelection = (root: ApplicationState, workspaceId: string, ...selectionIds: StructReference[]) => {
  return updateWorkspace(root, workspaceId, {
    selectionRefs: uniq([...selectionIds])
  });
};

export const updateWorkspace = (root: ApplicationState, workspaceId: string, newProperties: Partial<Workspace>) => {
  const workspace = getWorkspaceById(root, workspaceId);
  return {
    ...root,
    workspaces: arrayReplaceIndex(root.workspaces, root.workspaces.indexOf(workspace), {
      ...workspace,
      ...newProperties
    })
  }
};

export const createTargetSelector = (uri: string, value: string): TargetSelector => ({
  uri,
  value
});


export const toggleWorkspaceTargetCSSSelector = (root: ApplicationState, workspaceId: string, uri: string, selectorText: string) => {
  const workspace = getWorkspaceById(root, workspaceId);
  const cssSelectors = (workspace.targetCSSSelectors || []);
  const index = cssSelectors.findIndex((targetSelector) => {
    return targetSelector.uri === uri && targetSelector.value == selectorText;
  });
  return updateWorkspace(root, workspaceId, {
    targetCSSSelectors: index === -1 ? [...cssSelectors, createTargetSelector(uri, selectorText)] : arraySplice(cssSelectors, index, 1)
  });
};

export const addWorkspace = (root: ApplicationState, workspace: Workspace) => {
  return {
    ...root,
    workspaces: [...root.workspaces, workspace]
  };
}

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

export const getWorkspaceReference = (ref: StructReference, workspace: Workspace) => {
  if (ref[0] === ARTBOARD) {
    return getArtboardById(ref[1], workspace);
  }
  const artboard = getNodeArtboard(ref[1], workspace);
  return artboard && getNestedObjectById(ref[1], artboard.document);
};

export const getSyntheticNodeWorkspace = weakMemo((root: ApplicationState, nodeId: string): Workspace => {
  return getArtboardWorkspace(getNodeArtboard(nodeId, root).$id, root);
});

export const getBoundedWorkspaceSelection = weakMemo((workspace: Workspace): Array<Bounded & Struct> => workspace.selectionRefs.map((ref) => getWorkspaceReference(ref, workspace)).filter(item => getWorkspaceItemBounds(item, workspace)) as any);

export const getWorkspaceSelectionBounds = weakMemo((workspace: Workspace) => mergeBounds(...getBoundedWorkspaceSelection(workspace).map(boxed => getWorkspaceItemBounds(boxed, workspace))));

export const getNodeArtboard = weakMemo((nodeId: string, state: Workspace|ApplicationState): Artboard => {
  if (state.$type === WORKSPACE) {
    return (state as Workspace).artboards.find((artboard) => {
      return artboard.document && Boolean(getNestedObjectById(nodeId, artboard.document));
    })
  } else {
    for (const workspace of (state as ApplicationState).workspaces) {
      const artboard = getNodeArtboard(nodeId, workspace);
      if (artboard) {
        return artboard;
      }
    }
  }
});

export const getWorkspaceNode = weakMemo((nodeId: string, state: Workspace) => {
  return state.artboards.map(artboard => getNestedObjectById(nodeId, artboard.document)).find(Boolean);
});

export const getComputedNodeBounds = weakMemo((nodeId: string, artboard: Artboard) => {
  const info = artboard.computedDOMInfo;
  return info[nodeId] && info[nodeId].bounds;
});

export const getWorkspaceItemBounds = weakMemo((value: any, workspace: Workspace) => {
  if (!value) {
    return null;
  }
  if ((value as Artboard).$type === ARTBOARD) {
    return (value as Artboard).bounds;
  } else {
    const artboard = getNodeArtboard((value as SlimBaseNode).id, workspace);
    return shiftBounds(getComputedNodeBounds(value.id, artboard), artboard.bounds);
  } 
});

export const moveArtboardToBestPosition = (artboard: Artboard, state: ApplicationState) => {
  const size = artboard.bounds ? {
    width: artboard.bounds.right - artboard.bounds.left,
    height: artboard.bounds.bottom - artboard.bounds.top
  } : DEFAULT_ARTBOARD_SIZE;

  const workspace = getSelectedWorkspace(state);
  const bounds = workspace.artboards.length ? getArtboardBounds(workspace) : {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  };

  return {
    ...artboard,
    bounds: {
      left: ARTBOARD_PADDING + bounds.right,
      top: ARTBOARD_PADDING + bounds.top,
      right: ARTBOARD_PADDING + bounds.right + size.width,
      bottom: ARTBOARD_PADDING + bounds.top + size.height
    }
  }
}

export const roundArtboardBounds = (artboardId: string, state: ApplicationState) => {
  const { bounds } = getArtboardById(artboardId, state);
  return updateArtboard(state, artboardId, {
    bounds: roundBounds(bounds)
  })
};

export const getArtboardPreviewUri = (artboard: Artboard, state: ApplicationState) => state.apiHost + `/components/${artboard.componentId}/preview` + (artboard.previewName ? `/${artboard.previewName}` : "");

export const getStageZoom = (stage: Stage) => getStageTranslate(stage).zoom;

export const getStageTranslate = (stage: Stage) => stage.translate;

export const getWorkspaceById = (state: ApplicationState, id: string): Workspace => state.workspaces.find((workspace) => workspace.$id === id);
export const getSelectedWorkspace = (state: ApplicationState) => state.selectedWorkspaceId && getWorkspaceById(state, state.selectedWorkspaceId);

export const getAvailableComponent = (componentId: string, workspace: Workspace) => workspace.availableComponents.find(component => component.$id === componentId);

export const getWorkspaceLastSelectionOwnerArtboard = (state: ApplicationState, workspaceId: string = state.selectedWorkspaceId) => {
  const workspace = getWorkspaceById(state, workspaceId);
  if (workspace.selectionRefs.length === 0) {
    return null;
  }
  const lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];

  return lastSelectionRef[0] === ARTBOARD ? getArtboardById(lastSelectionRef[1], workspace) : getNodeArtboard(lastSelectionRef[1], workspace);
};

export const getArtboardById = weakMemo((artboardId: string, state: ApplicationState|Workspace): Artboard => {
  let workspace;
  if (state.$type === APPLICATION_STATE) {
    const appState = state as ApplicationState;
    workspace = getArtboardWorkspace(artboardId, appState);
    if (!workspace) {
      return null;
    }
  } else {
    workspace = state as Workspace;
  }

  return workspace.artboards.find(artboard => artboard.$id === artboardId);
});

export const getArtboardByInfo = (componentId: string, previewName: string, state: ApplicationState) => {
  for (const workspace of state.workspaces) {
    for (const artboard of workspace.artboards) {
      if (artboard.componentId === componentId && (artboard.previewName === previewName)) {
        return artboard;
      }
    }
  }
  return null;
}

export const getArtboardsByInfo = (componentId: string, previewName: string, state: ApplicationState) => {
  const artboards: Artboard[] = [];
  for (const workspace of state.workspaces) {
    for (const artboard of workspace.artboards) {
      if (artboard.componentId === componentId && (artboard.previewName === previewName)) {
        artboards.push(artboard);
      }
    }
  }
  return artboards;
}

export const getArtboardDocumentBody = (artboard: Artboard) => getDocumentBody(artboard.document);

export const getDocumentBody = (document: SlimParentNode): SlimElement => (document.childNodes[0] as SlimElement).childNodes[0] as SlimElement;

export const getDocumentBodyPreview = (document: SlimParentNode): SlimElement => getDocumentBody(document);

export const getArtboardDocumentBodyPath = (artboard: Artboard) => [0, 0];

export const getArtboardBounds = weakMemo((workspace: Workspace) => mergeBounds(...workspace.artboards.map(artboard => artboard.bounds)));

export const getArtboardWorkspace = weakMemo((artboardId: string, state: ApplicationState) => {
  const appState = state as ApplicationState;
  for (const workspace of appState.workspaces) {
    const artboard = getArtboardById(artboardId, workspace);
    if (artboard) return workspace;
  }
  return null;
});

export const updateArtboard = (state: ApplicationState, artboardId: string, properties: Partial<Artboard>) => {
  const workspace = getArtboardWorkspace(artboardId, state);
  const artboard = getArtboardById(artboardId, workspace);
  return updateWorkspace(state, workspace.$id, {
    artboards: arrayReplaceIndex(workspace.artboards, workspace.artboards.indexOf(artboard), {
      ...artboard,
      ...properties
    })
  })
};

export const updateArtboardSize = (state: ApplicationState, artboardId: string, width: number, height: number) => {
  const artboard = getArtboardById(artboardId, state);
  return updateArtboard(state, artboardId, {
    bounds: {
      left: artboard.bounds.left,
      top: artboard.bounds.top,
      right: artboard.bounds.left + width,
      bottom: artboard.bounds.top + height
    }
  });
}

export const removeArtboard = (artboardId: string, state: ApplicationState) => {
  const workspace = getArtboardWorkspace(artboardId, state);
  const artboard = getArtboardById(artboardId, workspace);
  return updateWorkspace(state, workspace.$id, {
    artboards: arrayRemoveItem(workspace.artboards, artboard)
  });
};

/**
 * Factories
 */

export const createWorkspace        = createStructFactory<Workspace>(WORKSPACE, {

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

export const createApplicationState = createStructFactory<ApplicationState>(APPLICATION_STATE, {
  workspaces: [],
  shortcuts:[
    createKeyboardShortcut("backspace", deleteShortcutPressed()),
    createKeyboardShortcut("meta+b", toggleLeftGutterPressed()),
    createKeyboardShortcut("ctrl+b", toggleLeftGutterPressed()),
    createKeyboardShortcut("meta+/", toggleRightGutterPressed()),
    createKeyboardShortcut("ctrl+/", toggleRightGutterPressed()),
    createKeyboardShortcut("meta+e", toggleTextEditorPressed()),
    createKeyboardShortcut("meta+f", fullScreenShortcutPressed()),
    createKeyboardShortcut("ctrl+f", fullScreenShortcutPressed()),
    createKeyboardShortcut("meta+=", zoomInShortcutPressed()),
    createKeyboardShortcut("meta+-", zoomOutShortcutPressed()),

    // ignore for now since project is scoped to Paperclip only. Windows
    // should be added in via the components pane.
    // createKeyboardShortcut("meta+t", openNewWindowShortcutPressed()),
    // createKeyboardShortcut("ctrl+t", openNewWindowShortcutPressed()),
    createKeyboardShortcut("meta+enter", cloneWindowShortcutPressed()),
    createKeyboardShortcut("escape", escapeShortcutPressed()),
    createKeyboardShortcut("ctrl+shift+]", nextArtboardShortcutPressed()),
    createKeyboardShortcut("ctrl+shift+[", prevArtboardShortcutPressed()),
    createKeyboardShortcut("ctrl+meta+t", toggleToolsShortcutPressed()),
    createKeyboardShortcut("up", { type: UP_KEY_DOWN }, { keyup: false }),
    createKeyboardShortcut("up", { type: UP_KEY_UP }, { keyup: true }),
    createKeyboardShortcut("down", { type: DOWN_KEY_DOWN }, { keyup: false }),
    createKeyboardShortcut("down", { type: DOWN_KEY_UP }, { keyup: true }),
    createKeyboardShortcut("left", { type: LEFT_KEY_DOWN }, { keyup: false }),
    createKeyboardShortcut("left", { type: LEFT_KEY_UP }, { keyup: true }),
    createKeyboardShortcut("right", { type: RIGHT_KEY_DOWN }, { keyup: false }),
    createKeyboardShortcut("right", { type: RIGHT_KEY_UP }, { keyup: true }),
  ]
});

export const createArtboard = createStructFactory<Artboard>(ARTBOARD, {
  loading: true,
  scrollPosition: {
    left: 0,
    top: 0
  }
});

export const selectWorkspace = (state: ApplicationState, selectedWorkspaceId: string) => ({
  ...state,
  selectedWorkspaceId,
});

export const getScaledMouseStagePosition = (state: ApplicationState, event: StageToolOverlayMouseMoved|StageToolOverlayClicked) => {
  const { sourceEvent: { pageX, pageY, nativeEvent } } = event as StageToolOverlayMouseMoved;

  const workspace = getSelectedWorkspace(state);
  const stage     = workspace.stage;

  const translate = getStageTranslate(stage);
  
  const scaledPageX = ((pageX - translate.left) / translate.zoom);
  const scaledPageY = ((pageY - translate.top) / translate.zoom);
  return { left: scaledPageX, top: scaledPageY };

}

export const getStageToolMouseNodeTargetReference = (state: ApplicationState, event: StageToolOverlayMouseMoved|StageToolOverlayClicked) => {
  
  const workspace = getSelectedWorkspace(state);
  const stage     = workspace.stage;

  const translate = getStageTranslate(stage);

  const {left: scaledPageX, top: scaledPageY } = getScaledMouseStagePosition(state, event);

  const artboard = stage.fullScreen ? getArtboardById(stage.fullScreen.artboardId, workspace) : workspace.artboards.find((artboard) => (
    pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, artboard.bounds)
  ));

  if (!artboard) return null;

  const mouseX = scaledPageX - artboard.bounds.left;
  const mouseY = scaledPageY - artboard.bounds.top;

  const computedInfo = artboard.computedDOMInfo || {};
  const intersectingBounds: Bounds[] = [];
  const intersectingBoundsMap = new Map<Bounds, string>();
  for (const $id in computedInfo) {
    const { bounds } = computedInfo[$id];
    if (pointIntersectsBounds({ left: mouseX, top: mouseY }, bounds)) {
      intersectingBounds.push(bounds);
      intersectingBoundsMap.set(bounds, $id);
    }
  }

  if (!intersectingBounds.length) return null;
  const smallestBounds = getSmallestBounds(...intersectingBounds);
  return [SlimVMObjectType.ELEMENT, intersectingBoundsMap.get(smallestBounds)] as [any, string];
}

export const serializeApplicationState = ({ workspaces, selectedWorkspaceId }: ApplicationState) => ({
  workspaces: workspaces.map(serializeWorkspace),
  selectedWorkspaceId
});

export const serializeWorkspace = (workspace: Workspace): Partial<Workspace> => ({
  $id: workspace.$id,
  $type: workspace.$type,
  targetCSSSelectors: workspace.targetCSSSelectors,
  selectionRefs: [],
  artboards: workspace.artboards.map(serializeArtboard),
  stage: serializeStage(workspace.stage),
  textEditor: workspace.textEditor,
  library: [],
  availableComponents: []
});

const serializeArtboard = ({ $id, $type, componentId, previewName, bounds }: Artboard): Artboard => ({ 
  $id,
  $type,
  componentId,
  previewName,
  bounds,
  scrollPosition: {
    left: 0,
    top: 0
  }
});

const serializeStage = ({ showTextEditor, showRightGutter, showLeftGutter, showTools, translate, fullScreen }: Stage): Stage => ({
  panning: false,
  translate,
  fullScreen,
  showTextEditor,
  showRightGutter,
  showLeftGutter,
  showTools: true
});

export const getArtboardLabel = (artboard: Artboard) => artboard.componentId + (artboard.previewName ? ` - ${artboard.previewName}` : ``);

export * from "./shortcuts";
export * from "./api";
export * from "./dnd";
