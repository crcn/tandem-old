import { arraySplice, Directory, memoize, EMPTY_ARRAY, StructReference, Point, Translate, Bounds, pointIntersectsBounds, getSmallestBounds, mergeBounds, Bounded, Struct, getTreeNodeIdMap, getNestedTreeNodeById, boundsFromRect, getFileFromUri, stringifyTreeNodeToXML, selectFile, File, deselectAllFiles, setNodeAttribute } from "../../common";
import { SyntheticBrowser, updateSyntheticBrowser, SyntheticWindow, updateSyntheticWindow, SyntheticDocument, getSyntheticWindow, SyntheticObjectType, getSyntheticDocumentComponent, getSyntheticWindowDependency, getComponentInfo, getSyntheticDocumentById, getSyntheticNodeDocument, getSyntheticNodeBounds, updateSyntheticItemPosition, updateSyntheticItemBounds, getSyntheticDocumentWindow, getModifiedDependencies, Dependency, SyntheticNode, setNodeExpanded, getSyntheticNodeById } from "../../paperclip";
import { CanvasToolOverlayMouseMoved, CanvasToolOverlayClicked } from "../actions";
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

export type RootState = {
  activeFilePath?: string;
  canvas: Canvas;
  mount: Element;
  openFiles: OpenFile[];
  hoveringNodeIds: string[];
  selectedNodeIds: string[];
  browser: SyntheticBrowser;
  projectDirectory?: Directory;
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

export const selectRootProjectFile = (file: File, multi: boolean, state: RootState) => updateRootState({
  projectDirectory: selectFile(file, multi, state.projectDirectory)
}, state);

export const deselectRootProjectFiles = (state: RootState) => updateRootState({
  projectDirectory: deselectAllFiles(state.projectDirectory)
}, state);

export const persistRootStateBrowser = (persistBrowserState: (state: SyntheticBrowser) => SyntheticBrowser, state: RootState) => {
  const oldGraph = state.browser.graph;
  state = keepActiveFileOpen(updateRootState({
    browser: persistBrowserState(state.browser)
  }, state));
  const modifiedDeps = getModifiedDependencies(oldGraph, state.browser.graph);
  state = modifiedDeps.reduce((state, dep: Dependency) => updateOpenFile({
    temporary: false,
    newContent: new Buffer(stringifyTreeNodeToXML(dep.content), "utf8")
  }, dep.uri, state), state);

  return state;
};

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

export const setRootStateNodeExpanded = (nodeId: string, value: boolean, state: RootState) => {
  const node = getSyntheticNodeById(nodeId, state.browser);
  const document = getSyntheticNodeDocument(node.id, state.browser);
  state = updateRootStateSyntheticWindowDocument(document.id, {
    root: setNodeExpanded(node, value, document.root)
  }, state);
  return state;
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

export const setCanvasTool = (toolType: CanvasToolType, root: RootState) => {
  if (!root.activeFilePath) {
    return root;
  }
  root = updateCanvas({ toolType }, root);
  root = setSelection(root);
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
  const documents = getAllWindowDocuments(state.browser);
  for (let i = documents.length; i--;)  {
    const document = documents[i];
    if (pointIntersectsBounds(point, document.bounds)) {
      return document.root.id;
    }
  }
}

export const setSelection = (root: RootState, ...selectionIds: string[]) => {
  const nodeIds = uniq([...selectionIds]);
  root = nodeIds.reduce((state, nodeId) => setRootStateNodeExpanded(nodeId, true, root), root);

  root = updateRootState({
    selectedNodeIds: nodeIds
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


export * from "./constants";
