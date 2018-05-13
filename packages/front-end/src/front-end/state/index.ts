import { arraySplice, Directory, memoize, EMPTY_ARRAY, StructReference, Point, Translate, Bounds, pointIntersectsBounds, getSmallestBounds, mergeBounds, Bounded, Struct, getTreeNodeIdMap, getNestedTreeNodeById, boundsFromRect, getFileFromUri, stringifyTreeNodeToXML, File, setNodeAttribute, updateNestedNode, FileAttributeNames, isDirectory, getParentTreeNode } from "../../common";
import { SyntheticBrowser, updateSyntheticBrowser, SyntheticWindow, updateSyntheticWindow, SyntheticDocument, getSyntheticWindow, SyntheticObjectType, getSyntheticWindowDependency, getComponentInfo, getSyntheticDocumentById, getSyntheticNodeDocument, getSyntheticNodeBounds, updateSyntheticItemPosition, updateSyntheticItemBounds, getSyntheticDocumentWindow, getModifiedDependencies, Dependency, SyntheticNode, setSyntheticNodeExpanded, getSyntheticNodeById, replaceDependency } from "../../paperclip";
import { CanvasToolOverlayMouseMoved, CanvasToolOverlayClicked, dependencyEntryLoaded } from "../actions";
import { uniq, pull } from "lodash";

export enum CanvasToolType {
  TEXT,
  RECTANGLE,
  ARTBOARD
};

export type Canvas = {
  backgroundColor: string;
  mousePosition?: Point;
  movingOrResizing?: boolean;
  panning?: boolean;
  translate: Translate;
  secondarySelection?: boolean;
  fullScreen?: boolean;
  toolType?: CanvasToolType;
  smooth?: boolean;
};

export enum InsertFileType {
  FILE,
  DIRECTORY
};

export type InsertFileInfo = {
  type: InsertFileType;
  directoryId: string;
}

export type DependencyHistory = {
  index: number;
  snapshots: Dependency[];
};

export type GraphHistory = {
  [identifier: string]: DependencyHistory
};

export type RootState = {
  activeFilePath?: string;
  canvas: Canvas;
  mount: Element;
  openFiles: OpenFile[];
  hoveringNodeIds: string[];
  selectedNodeIds: string[];
  selectedFileNodeIds: string[];
  browser: SyntheticBrowser;
  projectDirectory?: Directory;
  insertFileInfo?: InsertFileInfo;
  history: GraphHistory;
};

export type OpenFile = {
  temporary: boolean;
  newContent?: Buffer;
  uri: string;
}

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
  newContent: new Buffer(stringifyTreeNodeToXML(dep.content), "utf8")
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

export const undo = (uri: string, root: RootState) => moveDependencyRecordHistory(uri, -1, root);
export const redo = (uri: string, root: RootState) => moveDependencyRecordHistory(uri, 1, root);

export const getOpenFile = (uri: string, state: RootState) => state.openFiles.find((openFile) => openFile.uri === uri);

export const getOpenFilesWithContent = (state: RootState) => state.openFiles.filter(openFile => openFile.newContent);

export const updateOpenFileContent = (uri: string, newContent: Buffer, state: RootState) => {
  return updateOpenFile({
    temporary: false,
    newContent
  }, uri, state);
};

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

export const setNextOpenFile = (state: RootState): RootState => {
  const hasOpenFile = state.openFiles.find(openFile => state.activeFilePath === openFile.uri);
  if (hasOpenFile) {
    return state;
  }
  return {
    ...state,
    activeFilePath: state.openFiles.length ? state.openFiles[0].uri : null,
    hoveringNodeIds: [],
    selectedNodeIds: []
  };
};


export const removeTemporaryOpenFiles = (state: RootState) => {
  return {
    ...state,
    openFiles: state.openFiles.filter(openFile => !openFile.temporary)
  };
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

export const getInsertedWindowElementIds = (oldWindow: SyntheticWindow, newBrowser: SyntheticBrowser): string[] => {
  const elementIds = oldWindow.documents.reduce((nodeIds, oldDocument) => {
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

export const setRootStateFileNodeExpanded = (nodeId: string, value: boolean, state: RootState) => {
  return updateRootState({
    projectDirectory: updateNestedNode(getNestedTreeNodeById(nodeId, state.projectDirectory), state.projectDirectory, (child) => {
      return setNodeAttribute(child, FileAttributeNames.EXPANDED, value);
    })
  }, state);
};

export const setActiveFilePath = (newActiveFilePath: string, root: RootState) => {
  if (root.activeFilePath === newActiveFilePath) {
    return root;
  }
  if (!root.browser.windows.some(({location}) => location === newActiveFilePath)) {
    throw new Error(`Active file path is not currently open`);
  }
  return updateRootState({
    activeFilePath: newActiveFilePath,
    hoveringNodeIds: [],
    selectedNodeIds: []
  }, root);
};

export const updateCanvas = (properties: Partial<Canvas>, root: RootState) => {
  return updateRootState({
    canvas: {
      ...root.canvas,
      ...properties
    }
  }, root);
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

export const setCanvasTool = (toolType: CanvasToolType, root: RootState) => {
  if (!root.activeFilePath) {
    return root;
  }
  root = updateCanvas({ toolType }, root);
  root = setSelectedSyntheticNodeIds(root);
  return root;
}

export const getActiveWindow = (root: RootState) => root.browser.windows.find(window => window.location === root.activeFilePath);

export const getAllWindowDocuments = memoize((browser: SyntheticBrowser): SyntheticDocument[] => {
  return browser.windows.reduce((documents, window) => {
    return [...documents, ...(window.documents || EMPTY_ARRAY)];
  }, []);
});

export const getCanvasTranslate = (canvas: Canvas) => canvas.translate;

export const getScaledMouseCanvasPosition = (state: RootState, event: CanvasToolOverlayMouseMoved|CanvasToolOverlayClicked) => {
  const { sourceEvent: { pageX, pageY, nativeEvent } } = event as CanvasToolOverlayMouseMoved;
  const canvas     = state.canvas;
  const translate = getCanvasTranslate(canvas);

  const scaledPageX = ((pageX - translate.left) / translate.zoom);
  const scaledPageY = ((pageY - translate.top) / translate.zoom);
  return { left: scaledPageX, top: scaledPageY };
};

export const getCanvasMouseTargetNodeId = (state: RootState, event: CanvasToolOverlayMouseMoved|CanvasToolOverlayClicked): string => {

  const canvas     = state.canvas;
  const translate = getCanvasTranslate(canvas);


  const activeWindow = getActiveWindow(state);

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
  const activeWindow = getActiveWindow(state);
  if (!activeWindow) return null;
  const documents = activeWindow.documents || EMPTY_ARRAY;
  for (let i = documents.length; i--;)  {
    const document = documents[i];
    if (pointIntersectsBounds(point, document.bounds)) {
      return document.root.id;
    }
  }
}

export const setSelectedSyntheticNodeIds = (root: RootState, ...selectionIds: string[]) => {
  const nodeIds = uniq([...selectionIds]);
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

export const setHovering = (root: RootState, ...selectionIds: string[]) => {
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


