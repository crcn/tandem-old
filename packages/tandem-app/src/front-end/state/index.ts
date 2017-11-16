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
  BaseApplicationState,
  createImmutableArray,
  createImmutableObject,
  ImmutableArrayIdentity,
  ImmutableObjectIdentity,
  expressionLocationEquals,
  createImmutableStructFactory,
} from "aerial-common2";

import {
 AvalaibleComponent
} from "./api";

import { DNDState } from "./dnd";

import { createFileCacheStore, FileCacheRootState, FileCacheItem, getFileCacheItemById } from "aerial-sandbox2";

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
  nextWindowShortcutPressed,
  prevWindowShortcutPressed,
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
  SyntheticBrowser,
  SYNTHETIC_WINDOW,
  SYNTHETIC_ELEMENT,
  SyntheticElement,
  getSyntheticWindow,
  SyntheticCSSStyleRule,
  getSyntheticNodeById,
  getSyntheticNodeWindow,
  SyntheticNode,
  getSyntheticBrowser,
  getMatchingElements,
  elementMatches,
  SyntheticWindow,
  getSyntheticWindowChildStructs,
  syntheticNodeIsRelative,
  getSyntheticBrowserItemBounds,
  getSyntheticWindowBrowser,
  SYNTHETIC_CSS_STYLE_RULE,
  SyntheticBrowserRootState,
  createSyntheticBrowserStore,
  syntheticWindowContainsNode,
  getSyntheticBrowserStoreItemByReference,
} from "aerial-browser-sandbox";

import {
  uniq,
  difference,
  differenceWith
} from "lodash";

import { Kernel } from "aerial-common";

/**
 * Types
 */

export const WORKSPACE         = "WORKSPACE";
export const APPLICATION_STATE = "APPLICATION_STATE";
export const LIBRARY_COMPONENT = "LIBRARY_COMPONENT";

export type Stage = {
  secondarySelection?: boolean;
  fullScreen?: {
    windowId: string,
    originalTranslate: Translate;
    originalWindowBounds: Bounds,
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

export type LibraryComponent = {
  defaultAttributes: {
    [identifier: string]: string
  };
  defaultChildren?: SyntheticNode[];
} & LibraryItem;

export type Workspace = {
  targetCSSSelectors: TargetSelector[];
  selectionRefs: StructReference[]; // $type:$id;
  browserId: string;
  hoveringRefs: StructReference[];
  selectedFileId?: string;
  stage: Stage;
  textEditor: TextEditor;
  library: LibraryItem[];
  availableComponents: AvalaibleComponent[];
} & DNDState & Struct;

export type ApplicationState = {
  kernel: Kernel;
  workspaces: Workspace[];
  localStorageNamespace: string;
  selectedWorkspaceId?: string;
  element: HTMLElement;
  apiHost: string;
} & BaseApplicationState &  ShortcutServiceState & SyntheticBrowserRootState & FileCacheRootState & Struct;

/**
 * Utilities
 */

export const getFileExtension = (file: FileCacheItem) => file.sourceUri.split(".").pop();

export const getSelectedWorkspaceFile = (state: ApplicationState, workspace: Workspace): FileCacheItem => {
  return workspace.selectedFileId && getFileCacheItemById(state, workspace.selectedFileId);
}

export const getSyntheticWindowWorkspace = (root: ApplicationState, windowId: string): Workspace => getSyntheticBrowserWorkspace(root, getSyntheticWindowBrowser(root, windowId).$id);

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
  
  if (ref && ref[0] === SYNTHETIC_WINDOW) {
    return root;
  }

  const window = getSyntheticNodeWindow(root, ref[1]);

  const workspace = getWorkspaceById(root, workspaceId);
  const updatedSelection: StructReference[] = [];

  for (const selection of workspace.selectionRefs)   {
    if (syntheticWindowContainsNode(window, selection[1])) {
      updatedSelection.push(selection);
    }
  }

  return setWorkspaceSelection(root, workspaceId, ...updatedSelection);
};

/**
 * Prevents nodes that have a parent/child relationship from being selected.
 */

const deselectRelatedWorkspaceSelection = (root: ApplicationState, workspaceId: string, ref: StructReference) => {
  
  if (ref && ref[0] === SYNTHETIC_WINDOW) {
    return root;
  }

  const workspace = getWorkspaceById(root, workspaceId);
  const window = getSyntheticNodeWindow(root, ref[1]);
  const updatedSelection: StructReference[] = [];

  for (const selection of workspace.selectionRefs)   {
    if (!syntheticNodeIsRelative(window, ref[1], selection[1])) {
      updatedSelection.push(selection);
    }
  }

  return setWorkspaceSelection(root, workspaceId, ...updatedSelection);
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

export const filterMatchingTargetSelectors = weakMemo((targetCSSSelectors: TargetSelector[], element: SyntheticElement, window: SyntheticWindow) => filterApplicableTargetSelectors(targetCSSSelectors, window).filter((rule) => elementMatches(rule.value, element, window)));

const filterApplicableTargetSelectors = weakMemo((selectors: TargetSelector[], window: SyntheticWindow): TargetSelector[] => {
  const map = {};
  for (const selector of selectors) {
    map[selector.uri + selector.value] = selector;
  }

  const rules = [];

  const children = getSyntheticWindowChildStructs(window);
  for (const $id in children) {
    const child = children[$id] as SyntheticCSSStyleRule;
    if (child.$type === SYNTHETIC_CSS_STYLE_RULE && child.source && map[child.source.uri + child.selectorText]) {
      rules.push(map[child.source.uri + child.selectorText]);
    }
  }

  return uniq(rules);
});

const getSelectorAffectedWindows = weakMemo((targetCSSSelectors: TargetSelector[], browser: SyntheticBrowser): SyntheticWindow[] => {
  const affectedWindows: SyntheticWindow[] = [];

  for (const window of browser.windows) {
    if (filterApplicableTargetSelectors(targetCSSSelectors, window).length) {
      affectedWindows.push(window);
    }
  }

  return affectedWindows;
});

export const getObjectsWithSameSource = weakMemo((itemId: string, browser: SyntheticBrowser, limitToElementWindow?: boolean): any[] => {
  const target = getSyntheticNodeById(browser, itemId);
  const objects = {};
  const objectsWithSameSource = [];
  const windows = limitToElementWindow ? [getSyntheticNodeWindow(browser, itemId)] : browser.windows;
  for (const window of windows) {
    const windowsObjects = getSyntheticWindowChildStructs(window);
    for (const $id in windowsObjects) {
      const child = windowsObjects[$id];
      if (child.source && target.source && expressionLocationEquals(child.source, target.source)) {
        objectsWithSameSource.push(child);
      }
    }
  }
  return objectsWithSameSource;
});

export const getSelectorAffectedElements = weakMemo((elementId: string, targetCSSSelectors: TargetSelector[], browser: SyntheticBrowser, limitToElementWindow?: boolean): SyntheticElement[] => {
  const affectedElements: SyntheticElement[] = [];
  if (!targetCSSSelectors.length) {
    affectedElements.push(...getObjectsWithSameSource(elementId, browser, limitToElementWindow));
  } else {
    let affectedWindows = targetCSSSelectors.length ? getSelectorAffectedWindows(targetCSSSelectors, browser) : browser.windows;
    if (limitToElementWindow) {
      affectedWindows = [getSyntheticNodeWindow(browser, elementId)];
    }
    for (const window of affectedWindows) {
      for (const { value: selectorText } of targetCSSSelectors) {
        affectedElements.push(...getMatchingElements(window, selectorText));
      }
    }
  }

  return uniq(affectedElements);
});

export const getFrontEndItemByReference = (root: ApplicationState|SyntheticBrowser, ref: StructReference) => {
  return getSyntheticBrowserStoreItemByReference(root, ref);
};

export const getSyntheticNodeWorkspace = weakMemo((root: ApplicationState, nodeId: string): Workspace => {
  return getSyntheticWindowWorkspace(root, getSyntheticNodeWindow(root, nodeId).$id);
});

export const getBoundedWorkspaceSelection = weakMemo((state: ApplicationState|SyntheticBrowser, workspace: Workspace): Array<Bounded & Struct> => workspace.selectionRefs.map((ref) => getFrontEndItemByReference(state, ref)).filter(item => getSyntheticBrowserItemBounds(state, item)) as any);
export const getWorkspaceSelectionBounds = weakMemo((state: ApplicationState|SyntheticBrowser, workspace: Workspace) => mergeBounds(...getBoundedWorkspaceSelection(state, workspace).map(boxed => getSyntheticBrowserItemBounds(state, boxed))));

export const getStageZoom = (stage: Stage) => getStageTranslate(stage).zoom;

export const getStageTranslate = (stage: Stage) => stage.translate;

export const getWorkspaceById = (state: ApplicationState, id: string): Workspace => state.workspaces.find((workspace) => workspace.$id === id);
export const getSelectedWorkspace = (state: ApplicationState) => state.selectedWorkspaceId && getWorkspaceById(state, state.selectedWorkspaceId);

export const getWorkspaceLastSelectionOwnerWindow = (state: ApplicationState, workspaceId: string = state.selectedWorkspaceId) => {
  const workspace = getWorkspaceById(state, workspaceId);
  if (workspace.selectionRefs.length === 0) {
    return null;
  }
  const lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];
  return getWorkspaceLastSelectionOwnerWindow2(workspace, getSyntheticBrowser(state, workspace.browserId));
};

export const getWorkspaceLastSelectionOwnerWindow2 = (workspace: Workspace, browser: SyntheticBrowser) => {
  if (workspace.selectionRefs.length === 0) {
    return null;
  }
  const lastSelectionRef = workspace.selectionRefs[workspace.selectionRefs.length - 1];
  return lastSelectionRef[0] === SYNTHETIC_WINDOW ? getSyntheticWindow(browser, lastSelectionRef[1]) : getSyntheticNodeWindow(browser, lastSelectionRef[1]);
};

export const getWorkspaceWindow = (state: ApplicationState, workspaceId: string = state.selectedWorkspaceId, index?: number) => {
  const browser = getSyntheticBrowser(state, getWorkspaceById(state, workspaceId).browserId);
  return browser.windows[index == null ? browser.windows.length - 1 : 0];
};

/**
 * Factories
 */

export const createWorkspace        = createStructFactory<Workspace>(WORKSPACE, {

  // null to denote style attribute
  targetCSSSelectors: [],
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
    createKeyboardShortcut("ctrl+shift+]", nextWindowShortcutPressed()),
    createKeyboardShortcut("ctrl+shift+[", prevWindowShortcutPressed()),
    createKeyboardShortcut("ctrl+meta+t", toggleToolsShortcutPressed()),
    createKeyboardShortcut("up", { type: UP_KEY_DOWN }, { keyup: false }),
    createKeyboardShortcut("up", { type: UP_KEY_UP }, { keyup: true }),
    createKeyboardShortcut("down", { type: DOWN_KEY_DOWN }, { keyup: false }),
    createKeyboardShortcut("down", { type: DOWN_KEY_UP }, { keyup: true }),
    createKeyboardShortcut("left", { type: LEFT_KEY_DOWN }, { keyup: false }),
    createKeyboardShortcut("left", { type: LEFT_KEY_UP }, { keyup: true }),
    createKeyboardShortcut("right", { type: RIGHT_KEY_DOWN }, { keyup: false }),
    createKeyboardShortcut("right", { type: RIGHT_KEY_UP }, { keyup: true }),
  ],
  fileCacheStore: createFileCacheStore(),
  browserStore: createSyntheticBrowserStore()
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

  const browser  = getSyntheticBrowser(state, workspace.browserId);
  const window = stage.fullScreen ? getSyntheticWindow(state, stage.fullScreen.windowId) : browser.windows.find((window) => (
    pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, window.bounds)
  ));

  if (!window) return null;

  const mouseX = scaledPageX - window.bounds.left;
  const mouseY = scaledPageY - window.bounds.top;

  const allComputedBounds = window.allComputedBounds;
  const intersectingBounds: Bounds[] = [];
  const intersectingBoundsMap = new Map<Bounds, string>();
  for (const $id in allComputedBounds) {
    const bounds = allComputedBounds[$id];
    if (pointIntersectsBounds({ left: mouseX, top: mouseY }, bounds)) {
      intersectingBounds.push(bounds);
      intersectingBoundsMap.set(bounds, $id);
    }
  }
  if (!intersectingBounds.length) return null;
  const smallestBounds = getSmallestBounds(...intersectingBounds);
  return [SYNTHETIC_ELEMENT, intersectingBoundsMap.get(smallestBounds)] as [string, string];
}

export const serializeApplicationState = ({ workspaces, selectedWorkspaceId, windowStore, browserStore }: ApplicationState) => ({
  workspaces: workspaces.map(serializeWorkspace),
  selectedWorkspaceId,
  windowStore: serialize(windowStore),
  browserStore: serialize(browserStore)
});

export const serializeWorkspace = (workspace: Workspace): Partial<Workspace> => ({
  $id: workspace.$id,
  $type: workspace.$type,
  targetCSSSelectors: workspace.targetCSSSelectors,
  selectionRefs: [],
  browserId: workspace.browserId,
  stage: serializeStage(workspace.stage),
  textEditor: workspace.textEditor,
  library: [],
  availableComponents: []
});

const serializeStage = ({ showTextEditor, showRightGutter, showLeftGutter, showTools }: Stage): Stage => ({
  panning: false,
  translate: { left: 0, top: 0, zoom: 1 },
  showTextEditor,
  showRightGutter,
  showLeftGutter,
  showTools: true
});

export * from "./shortcuts";
export * from "aerial-browser-sandbox/src/state";
export * from "./api";
export * from "./dnd";
