import { arraySplice, Directory, memoize, EMPTY_ARRAY, StructReference, Point, Translate, Bounds, pointIntersectsBounds, getSmallestBounds, mergeBounds, Bounded, Struct, getTreeNodeIdMap, getNestedTreeNodeById, boundsFromRect, getFileFromUri, stringifyTreeNodeToXML, File, setNodeAttribute, updateNestedNode, FileAttributeNames, isDirectory, getParentTreeNode, TreeNode, addTreeNodeIds, stripTreeNodeIds, getBoundsSize, centerTransformZoom, createZeroBounds, getTreeNodeHeight, flattenTreeNode, shiftBounds, shiftPoint, flipPoint, moveBounds } from "../../common";
import { SyntheticBrowser, updateSyntheticBrowser, SyntheticWindow, updateSyntheticWindow, SyntheticDocument, getSyntheticWindow, SyntheticObjectType, getSyntheticWindowDependency, getComponentInfo, getSyntheticDocumentById, getSyntheticNodeDocument, getSyntheticNodeBounds, updateSyntheticItemPosition, updateSyntheticItemBounds, getSyntheticDocumentWindow, getModifiedDependencies, Dependency, SyntheticNode, setSyntheticNodeExpanded, getSyntheticNodeById, replaceDependency, createSyntheticWindow, evaluateDependencyEntry, createSyntheticDocument, getSyntheticOriginSourceNode, getSyntheticOriginSourceNodeUri, findSourceSyntheticNode, EDITOR_NAMESPACE, isSyntheticDocumentRoot } from "../../paperclip";
import { CanvasToolOverlayMouseMoved, CanvasToolOverlayClicked, dependencyEntryLoaded } from "../actions";
import { uniq, pull } from "lodash";
import { stat } from "fs";

export enum ToolType {
  TEXT,
  RECTANGLE,
  ARTBOARD
};

export type Canvas = {
  backgroundColor: string;
  mousePosition?: Point;
  movingOrResizing?: boolean;
  container?: HTMLElement;
  panning?: boolean;
  translate: Translate;
  secondarySelection?: boolean;
  fullScreen?: boolean;
  smooth?: boolean;
};

export enum InsertFileType {
  FILE,
  DIRECTORY
};

export type InsertFileInfo = {
  type: InsertFileType;
  directoryId: string;
};

export type DependencyHistory = {
  index: number;
  snapshots: Dependency[];
};

export type GraphHistory = {
  [identifier: string]: DependencyHistory
};

export type Editor = {
  activeFilePath?: string;
  tabUris: string[];
  canvas: Canvas;
};

export type RootState = {
  editors: Editor[];
  mount: Element;
  openFiles: OpenFile[];
  toolType?: ToolType;
  activeEditorFilePath?: string;
  hoveringNodeIds: string[];
  selectedNodeIds: string[];
  selectedFileNodeIds: string[];
  selectedComponentVariantName?: string;
  browser: SyntheticBrowser;
  projectDirectory?: Directory;
  insertFileInfo?: InsertFileInfo;
  history: GraphHistory;
  showQuickSearch?: boolean;
};

export type OpenFile = {
  temporary: boolean;
  newContent?: Buffer;
  uri: string;
};

export const updateRootState = (properties: Partial<RootState>, root: RootState) => ({
  ...root,
  ...properties,
});

export const deselectRootProjectFiles = (state: RootState) => updateRootState({
  selectedFileNodeIds: []
}, state);

export const persistRootStateBrowser = (persistBrowserState: (state: SyntheticBrowser) => SyntheticBrowser, state: RootState) => {
  const oldGraph = state.browser.graph;
  state = keepActiveFileOpen(updateRootState({
    browser: persistBrowserState(state.browser)
  }, state));
  const modifiedDeps = getModifiedDependencies(oldGraph, state.browser.graph);
  state = addHistory(state, modifiedDeps.map(dep => oldGraph[dep.uri]));
  state = modifiedDeps.reduce((state, dep: Dependency) => setOpenFileContent(dep, state), state);
  return state;
};


const setOpenFileContent = (dep: Dependency, state: RootState) => updateOpenFile({
  temporary: false,
  newContent: new Buffer(JSON.stringify(stripTreeNodeIds(dep.content), null, 2), "utf8")
}, dep.uri, state);

const addHistory = (root: RootState, modifiedDeps: Dependency[]) => {
  return modifiedDeps.reduce((state, dep) => {
    const history: DependencyHistory = state.history[dep.uri] || {
      index: 0,
      snapshots: EMPTY_ARRAY
    };

    const snapshots = [...history.snapshots.slice(0, history.index), dep];

    return updateRootState({
      history: {
        [dep.uri]: {
          index: snapshots.length,
          snapshots,
        }
      }
    }, state);
  }, root);
};

const moveDependencyRecordHistory = (uri: string, pos: number, root: RootState): RootState => {
  const record = root.history[uri];
  if (!record) {
    return root;
  }

  const index = Math.max(0, Math.min(record.snapshots.length, record.index + pos));

  // if index exceeds snapshot count, then we're at the end.
  const dep = record.snapshots[index] || root.browser.graph[uri];

  root = updateRootState({
    history: {
      [uri]: {
        ...record,
        index
      }
    },
    selectedFileNodeIds: [],
    selectedNodeIds: [],
    hoveringNodeIds: []
  }, root);

  root = setOpenFileContent(dep, root);
  root = updateRootStateSyntheticBrowser(replaceDependency(dep, root.browser), root);

  return root;
}

const DEFAULT_CANVAS: Canvas = {
  backgroundColor: "#EEE",
  translate: {
    left: 0,
    top: 0,
    zoom: 1
  }
};

const SNAP_PADDING = 5;

// Todo - restrict to viewport

export const snapBounds = (bounds: Bounds, selectedNodeIds: string[], browser: SyntheticBrowser) => {

  const guides = getSnapGuides(bounds, selectedNodeIds, browser);
  return guides;

  return bounds;
};

export const getSnapGuides = memoize((bounds: Bounds, selectedNodeIds: string[], browser: SyntheticBrowser) => {
  let alignableBounds: Bounds[];

  const firstNode = getSyntheticNodeById(selectedNodeIds[0], browser);
  const document = getSyntheticNodeDocument(firstNode.id, browser);

  bounds = shiftBounds(bounds, flipPoint(document.bounds));

  if (isSyntheticDocumentRoot(selectedNodeIds[0], browser)) {
    const window = getSyntheticDocumentWindow(document.id, browser);
    alignableBounds = window.documents.map(document => selectedNodeIds.indexOf(document.root.id) === -1 && document.bounds).filter(Boolean);
  } else {
    const highestNode = selectedNodeIds.concat().sort((a, b) => getTreeNodeHeight(a, document.root) > getTreeNodeHeight(b, document.root) ? 1 : -1)[0];
    const highestNodeParent = getParentTreeNode(highestNode, document.root);

    // omit items that are being dragged
    alignableBounds = flattenTreeNode(highestNodeParent).map(node => node.id !== highestNodeParent.id && selectedNodeIds.indexOf(node.id) === -1 && document.computed[node.id] && document.computed[node.id].bounds).filter(Boolean);
  }

  const { width, height } = getBoundsSize(bounds);
  let left: number = bounds.left;
  let top: number = bounds.top;
  const orgLeft = bounds.left;
  const orgTop  = bounds.top;

  let guideLeft;
  let guideTop;

  for (let i = 0, n = alignableBounds.length; i < n; i++) {
    const nodeBounds = alignableBounds[i];

    if (orgLeft === left) {
      [guideLeft, left] = snap(left, nodeBounds.left, width, nodeBounds.right - nodeBounds.left);
    }

    if (orgTop === top) {
      [guideTop, top] = snap(top, nodeBounds.top, height, nodeBounds.bottom - nodeBounds.top);
    }

    // when bounds intersect two items
    if (orgLeft !== left && orgTop !== top) {
      break;
    }
  }

  return moveBounds(bounds, {
    left: left + document.bounds.left,
    top: top + document.bounds.top
  });
});

const snap = (fromLeft, toLeft, fromWidth, toWidth, margin: number = 5) => {
  const fromMidWidth = fromWidth / 2;
  const fromMidLeft  = fromLeft + fromMidWidth;
  const toMidLeft    = toLeft + toWidth / 2;
  const toRight      = toLeft + toWidth;
  const fromRight    = fromLeft + fromWidth;

  const lines = [

    // left matches left
    [fromLeft, toLeft],

    // right matches left
    [fromRight, toLeft, -fromWidth],

    // right matches right
    [fromRight, toRight, -fromWidth],

    // left matches right
    [fromLeft, toRight],

    // left matches mid
    [fromLeft, toMidLeft],

    // left matches mid
    [fromRight, toMidLeft, -fromWidth],

    // mid matches mide
    [fromMidLeft, toMidLeft, -fromMidWidth],

    // mid matches right
    [fromMidLeft, toRight, -fromMidWidth],

    // mid matches left
    [fromMidLeft, toLeft, -fromMidWidth],

    // default
    [fromLeft],
  ];

  for (const [from, to = -1, offset = 0] of lines) {

    // no guide. Return from.
    if (to === -1) {
      return [-1, from];
    }

    if ((from < to + margin) && (from > to - margin)) {
      return [to, to + offset];
    }
  }
};

export const undo = (root: RootState) => root.editors.reduce((state, editor) => moveDependencyRecordHistory(editor.activeFilePath, -1, root), root);
export const redo = (root: RootState) => root.editors.reduce((state, editor) => moveDependencyRecordHistory(editor.activeFilePath, 1, root), root);

export const getOpenFile = (uri: string, state: RootState) => state.openFiles.find((openFile) => openFile.uri === uri);

export const getOpenFilesWithContent = (state: RootState) => state.openFiles.filter(openFile => openFile.newContent);

export const updateOpenFileContent = (uri: string, newContent: Buffer, state: RootState) => {
  return updateOpenFile({
    temporary: false,
    newContent
  }, uri, state);
};

export const getActiveEditor = (state: RootState) => getEditorWithActiveFileUri(state.activeEditorFilePath, state);

export const updateOpenFile = (properties: Partial<OpenFile>, uri: string, state: RootState) => {
  const file = getOpenFile(uri, state);

  if (!file) {
    state = addOpenFile(uri, false, state);
    return updateOpenFile(properties, uri, state);
  }

  const index = state.openFiles.indexOf(file);
  return updateRootState({
    openFiles: arraySplice(state.openFiles, index, 1, {
      ...file,
      ...properties
    })
  }, state);
};

export const upsertOpenFile = (uri: string, temporary: boolean, state: RootState): RootState => {
  const file = getOpenFile(uri, state);
  if (file) {
    if (file.temporary !== temporary) {
      return updateOpenFile({ temporary }, uri, state);
    }
    return state;
  }

  return addOpenFile(uri, temporary, state);
};

export const getEditorWithFileUri = (uri: string, state: RootState): Editor => {
  return state.editors.find(editor => editor.tabUris.indexOf(uri) !== -1);
};

export const getEditorWithActiveFileUri = (uri: string, state: RootState): Editor => {
  return state.editors.find(editor => editor.activeFilePath === uri);
};

export const openSecondEditor = (uri: string, state: RootState) => {
  const editor = getEditorWithFileUri(uri, state);
  const i = state.editors.indexOf(editor);
  if (i === 1) {
    return openEditorFileUri(uri, state);
  }

  if (i === 0 && editor.tabUris.length === 1) {
    return state;
  }

  const newTabUris = arraySplice(editor.tabUris, editor.tabUris.indexOf(uri), 1);

  state = {
    ...state,
    editors: arraySplice(state.editors, i, 1, {
      ...editor,
      tabUris: newTabUris,
      activeFilePath: editor.activeFilePath === uri ? newTabUris[newTabUris.length - 1] : editor.activeFilePath,
    })
  };

  if (state.editors.length === 1) {
    state = {
      ...state,
      editors: [
        ...state.editors,

        { tabUris: [], activeFilePath: null, canvas: DEFAULT_CANVAS }
      ]
    }
  };

  const secondEditor = state.editors[1];
  return {
    ...state,
    editors: arraySplice(state.editors, state.editors.indexOf(secondEditor), 1, {
      ...secondEditor,
      tabUris: [
        ...secondEditor.tabUris,
        uri
      ],
      activeFilePath: uri,
    })
  }
};

export const getSyntheticWindowBounds = memoize((uri: string, state: RootState) => {
  const window = getSyntheticWindow(uri, state.browser);
  if (!window) return createZeroBounds();
  return mergeBounds(...(window.documents || EMPTY_ARRAY).map(document => document.bounds));
});

export const openEditorFileUri = (uri: string, state: RootState): RootState => {
  const editor = getEditorWithFileUri(uri, state) || state.editors[0];

  return {
    ...state,
    hoveringNodeIds: [],
    selectedNodeIds: [],
    activeEditorFilePath: uri,
    editors: editor ? arraySplice(state.editors, state.editors.indexOf(editor) , 1, {
      ...editor,
      tabUris: editor.tabUris.indexOf(uri) === -1 ? [
        ...editor.tabUris,
        uri,
      ] : editor.tabUris,
      activeFilePath: uri
    }) : [{
      tabUris: [uri],
      activeFilePath: uri,
      canvas: DEFAULT_CANVAS
    }]
  }
};

export const setNextOpenFile = (state: RootState): RootState => {
  const hasOpenFile = state.openFiles.find(openFile => Boolean(getEditorWithActiveFileUri(openFile.uri, state)));
  if (hasOpenFile) {
    return state;
  }
  state = {
    ...state,
    hoveringNodeIds: [],
    selectedNodeIds: []
  };

  if (state.openFiles.length) {
    state = openEditorFileUri(state.openFiles[0].uri, state);
  }

  state = {
    ...state,
    editors: []
  };

  return state;
};

export const removeTemporaryOpenFiles = (state: RootState) => {
  return {
    ...state,
    openFiles: state.openFiles.filter(openFile => !openFile.temporary)
  };
};

export const openSyntheticNodeOriginWindow = (nodeId: string, state: RootState) => {
  const node = getSyntheticNodeById(nodeId, state.browser);
  const sourceNode = getSyntheticOriginSourceNode(node as SyntheticNode, state.browser);
  const uri = getSyntheticOriginSourceNodeUri(node as SyntheticNode, state.browser);
  state = openSyntheticWindow(uri, state);
  const instance = findSourceSyntheticNode(sourceNode, uri, state.browser);
  state = setActiveFilePath(uri, state);
  state = setSelectedSyntheticNodeIds(state, instance.id);
  return state;
};

export const addOpenFile = (uri: string, temporary: boolean, state: RootState): RootState => {
  const file = getOpenFile(uri, state);
  if (file) {
    return state;
  }

  state = removeTemporaryOpenFiles(state);

  return {
    ...state,
    openFiles: [
      ...state.openFiles,
      {
        uri,
        temporary
      }
    ]
  }
};

export const getInsertedWindowElementIds = (oldWindow: SyntheticWindow, targetDocumentId: string, newBrowser: SyntheticBrowser): string[] => {
  const elementIds = oldWindow.documents.filter(document => !targetDocumentId || document.id === targetDocumentId).reduce((nodeIds, oldDocument) => {
    return [...nodeIds, ...getInsertedDocumentElementIds(oldDocument, newBrowser)];
  }, []);
  const newWindow = newBrowser.windows.find(window => window.location === oldWindow.location);
  return [
    ...elementIds,
    ...newWindow.documents.filter(document => {
      const isInserted = oldWindow.documents.find(oldDocument => {
        return oldDocument.id === document.id
      }) == null
      return isInserted;
    }).map(document => document.root.id)
  ];
};

export const getInsertedDocumentElementIds = (oldDocument: SyntheticDocument, newBrowser: SyntheticBrowser): string[] => {
  const newDocument = getSyntheticDocumentById(oldDocument.id, newBrowser);
  if (!newDocument) {
    return [];
  }
  const oldIds = Object.keys(oldDocument.nativeNodeMap);
  const newIds = Object.keys(newDocument.nativeNodeMap);
  return pull(newIds, ...oldIds)
};

export const keepActiveFileOpen = (state: RootState): RootState => {
  return {
    ...state,
    openFiles: state.openFiles.map(openFile => ({
      ...openFile,
      temporary: false
    }))
  }
};

export const updateRootStateSyntheticBrowser = (properties: Partial<SyntheticBrowser>, root: RootState) => updateRootState({
  browser: updateSyntheticBrowser(properties, root.browser)
}, root);

export const updateRootStateSyntheticWindow = (location: string, properties: Partial<SyntheticWindow>, root: RootState) => updateRootState({
  browser: updateSyntheticWindow(location, properties, root.browser)
}, root);

export const updateRootStateSyntheticWindowDocument = (documentId: string, properties: Partial<SyntheticDocument>, root: RootState) => {
  const window = getSyntheticDocumentWindow(documentId, root.browser);
  const document = getSyntheticDocumentById(documentId, root.browser);
  return updateRootState({
    browser: updateSyntheticWindow(window.location, {
      documents: arraySplice(window.documents, window.documents.indexOf(document), 1, {
        ...document,
        ...properties
      })
    }, root.browser)
  }, root);
};

export const setRootStateSyntheticNodeExpanded = (nodeId: string, value: boolean, state: RootState) => {
  const node = getSyntheticNodeById(nodeId, state.browser);
  const document = getSyntheticNodeDocument(node.id, state.browser);
  state = updateRootStateSyntheticWindowDocument(document.id, {
    root: setSyntheticNodeExpanded(node, value, document.root)
  }, state);
  return state;
};

export const setRootStateSyntheticNodeLabelEditing = (nodeId: string, value: boolean, state: RootState) => {
  const node = getSyntheticNodeById(nodeId, state.browser);
  const document = getSyntheticNodeDocument(node.id, state.browser);
  state = updateRootStateSyntheticWindowDocument(document.id, {
    root: updateNestedNode(node, document.root, node => setNodeAttribute(node, "editingLabel", value, EDITOR_NAMESPACE))
  }, state);
  return state;
};

export const setRootStateFileNodeExpanded = (nodeId: string, value: boolean, state: RootState) => {
  return updateRootState({
    projectDirectory: updateNestedNode(getNestedTreeNodeById(nodeId, state.projectDirectory), state.projectDirectory, (child) => {
      return setNodeAttribute(child, FileAttributeNames.EXPANDED, value);
    })
  }, state);
};

export const openSyntheticWindow = (uri: string, state: RootState): RootState => {
  const graph = state.browser.graph;
  const entry = graph[uri];
  if (!entry) {
    throw new Error(`Cannot open window if graph entry is not loaded`);
  }

  const existingWindow = state.browser.windows.find(window => window.location === uri);

  // return window -- should use updateDependencyAndRevaluate if dep changed
  if (existingWindow) {
    return state;
  }

  state = updateRootStateSyntheticBrowser({
    windows: [
      ...state.browser.windows,
      createSyntheticWindow(uri)
    ]
  }, state);

  const documents = evaluateDependencyEntry({ entry, graph }).documentNodes.map(root => {
    return createSyntheticDocument(root, graph[root.source.uri].content);
  });

  return updateRootStateSyntheticWindow(entry.uri, {
    documents,
  }, state);
};

export const updateEditor = (properties: Partial<Editor>, uri: string, root: RootState) => {
  const editor = getEditorWithFileUri(uri, root);
  const i = root.editors.indexOf(editor);
  return updateRootState({
    editors: arraySplice(root.editors, i, 1, {
      ...editor,
      ...properties
    })
  }, root);
}

const INITIAL_ZOOM_PADDING = 50;

export const centerEditorCanvas = (state: RootState, editorFileUri: string, innerBounds?: Bounds, smooth: boolean = false, zoomOrZoomToFit: boolean|number = true) => {

  if (!innerBounds) {
    const window = getSyntheticWindow(editorFileUri, state.browser);
    if (!window || !window.documents || !window.documents.length) {
      return state;
    }

    innerBounds = getSyntheticWindowBounds(editorFileUri, state);
  }

  // no windows loaded
  if (innerBounds.left + innerBounds.right + innerBounds.top + innerBounds.bottom === 0) {
    console.warn(` Cannot center when bounds has no size`);
    return updateEditorCanvas({
      translate: { left: 0, top: 0, zoom: 1 }
    }, editorFileUri, state);
  }

  const editor = getEditorWithFileUri(editorFileUri, state);
  const { canvas: { container, translate }} = editor;
  if (!container) {
    console.warn("cannot center canvas without a container");
    return state;
  }

  const { width, height } = container.getBoundingClientRect();

  const innerSize = getBoundsSize(innerBounds);

  const centered = {
    left: -innerBounds.left + width / 2 - (innerSize.width) / 2,
    top: -innerBounds.top + height / 2 - (innerSize.height) / 2,
  };

  const scale = typeof zoomOrZoomToFit === "boolean" ? Math.min(
    (width - INITIAL_ZOOM_PADDING) / innerSize.width,
    (height - INITIAL_ZOOM_PADDING) / innerSize.height
  ) : typeof zoomOrZoomToFit === "number" ? zoomOrZoomToFit : translate.zoom;

  state = updateEditorCanvas({
    smooth,
    translate: centerTransformZoom({
      ...centered,
      zoom: 1
    }, { left: 0, top: 0, right: width, bottom: height }, Math.min(scale, 1))
  }, editorFileUri, state);

  return state;
};


export const setActiveFilePath = (newActiveFilePath: string, root: RootState) => {
  if (getEditorWithActiveFileUri(newActiveFilePath, root)) {
    return root;
  }
  root = openEditorFileUri(newActiveFilePath, root);
  root = addOpenFile(newActiveFilePath, true, root);
  root = centerEditorCanvas(root, newActiveFilePath);
  return root;
};

export const updateEditorCanvas = (properties: Partial<Canvas>, uri: string, root: RootState) => {
  const editor = getEditorWithFileUri(uri, root);
  return updateEditor({
    canvas: {
      ...editor.canvas,
      ...properties
    }
  }, uri, root);
}

export const setInsertFile = (type: InsertFileType, state: RootState) => {
  const file = getNestedTreeNodeById(state.selectedFileNodeIds[0] || state.projectDirectory.id, state.projectDirectory);
  return updateRootState({
    insertFileInfo: {
      type,
      directoryId: isDirectory(file) ? file.id : getParentTreeNode(file.id, state.projectDirectory).id
    }
  }, state);
};

export const setTool = (toolType: ToolType, root: RootState) => {
  if (!root.editors.length) {
    return root;
  }
  root = updateRootState({ toolType }, root);
  root = setSelectedSyntheticNodeIds(root);
  return root;
}

export const getActiveWindows = (root: RootState) => root.browser.windows.filter(window => root.editors.some(editor => editor.activeFilePath === window.location));

export const getAllWindowDocuments = memoize((browser: SyntheticBrowser): SyntheticDocument[] => {
  return browser.windows.reduce((documents, window) => {
    return [...documents, ...(window.documents || EMPTY_ARRAY)];
  }, []);
});

export const getCanvasTranslate = (canvas: Canvas) => canvas.translate;

export const getScaledMouseCanvasPosition = (state: RootState, event: CanvasToolOverlayMouseMoved|CanvasToolOverlayClicked) => {
  const { sourceEvent: { pageX, pageY, nativeEvent } } = event as CanvasToolOverlayMouseMoved;
  const canvas     = getActiveEditor(state).canvas;
  const translate = getCanvasTranslate(canvas);

  const scaledPageX = ((pageX - translate.left) / translate.zoom);
  const scaledPageY = ((pageY - translate.top) / translate.zoom);
  return { left: scaledPageX, top: scaledPageY };
};

export const getCanvasMouseTargetNodeId = (state: RootState, event: CanvasToolOverlayMouseMoved|CanvasToolOverlayClicked): string => {

  const canvas     = getActiveEditor(state).canvas;
  const translate = getCanvasTranslate(canvas);

  const documentRootId = getCanvasMouseDocumentRootId(state, event);

  if (!documentRootId) return null;

  const document = getSyntheticNodeDocument(documentRootId, state.browser);

  const {left: scaledPageX, top: scaledPageY } = getScaledMouseCanvasPosition(state, event);

  const mouseX = scaledPageX - document.bounds.left;
  const mouseY = scaledPageY - document.bounds.top;

  const computedInfo = document.computed || {};
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
  return intersectingBoundsMap.get(smallestBounds);
};

export const getCanvasMouseDocumentRootId = (state: RootState, event: CanvasToolOverlayMouseMoved|CanvasToolOverlayClicked) => {
  return getDocumentRootIdFromPoint(getScaledMouseCanvasPosition(state, event), state);
}

export const getDocumentRootIdFromPoint = (point: Point, state: RootState) => {
  const activeWindows = getActiveWindows(state);
  if (!activeWindows.length) return null;
  for (let j = activeWindows.length; j--;) {
    const documents = activeWindows[j].documents || EMPTY_ARRAY;
    for (let i = documents.length; i--;)  {
      const document = documents[i];
      if (pointIntersectsBounds(point, document.bounds)) {
        return document.root.id;
      }
    }
  }
}

export const setSelectedSyntheticNodeIds = (root: RootState, ...selectionIds: string[]) => {
  const nodeIds = uniq([...selectionIds]).filter(Boolean);
  root = nodeIds.reduce((state, nodeId) => setRootStateSyntheticNodeExpanded(nodeId, true, root), root);
  root = updateRootState({
    selectedNodeIds: nodeIds
  }, root);
  return root;
};

export const setSelectedFileNodeIds = (root: RootState, ...selectionIds: string[]) => {
  const nodeIds = uniq([...selectionIds]);
  root = nodeIds.reduce((state, nodeId) => setRootStateFileNodeExpanded(nodeId, true, root), root);

  root = updateRootState({
    selectedFileNodeIds: nodeIds
  }, root);
  return root;
};

export const setHoveringSyntheticNodeIds = (root: RootState, ...selectionIds: string[]) => {
  return updateRootState({
    hoveringNodeIds: uniq([...selectionIds])
  }, root);
};

const uniqRefs = (refs: StructReference<any>[]) => {
  const used = {};
  const uniq: StructReference<any>[] = [];

  for (const ref of refs) {
    if (used[ref.id]) {
      continue;
    }
    used[ref.id] = true;
    uniq.push(ref);
  }

  return uniq;
}

export const getReference = (ref: StructReference<any>, root: RootState) => {
  if (ref.type === SyntheticObjectType.DOCUMENT) {
    return getSyntheticDocumentById(ref.id, root.browser);
  }

  const document = getSyntheticNodeDocument(ref.id, root.browser);
  return document && getNestedTreeNodeById(ref.id, document.root);
};

export const updateRootSyntheticPosition = (position: Point, nodeId: string, root: RootState) => updateRootState({
  browser: updateSyntheticItemPosition(position, nodeId, root.browser)
}, root);

export const updateRootSyntheticBounds = (bounds: Bounds, nodeId: string, root: RootState) => updateRootState({
  browser: updateSyntheticItemBounds(bounds, nodeId, root.browser)
}, root);

export const getBoundedSelection = memoize((root: RootState): string[] => root.selectedNodeIds.filter(nodeId => getSyntheticNodeBounds(nodeId, root.browser)));
export const getSelectionBounds = memoize((root: RootState) => mergeBounds(...getBoundedSelection(root).map(nodeId => getSyntheticNodeBounds(nodeId, root.browser))));


