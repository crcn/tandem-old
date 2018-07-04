import {
  arraySplice,
  Directory,
  memoize,
  EMPTY_ARRAY,
  Point,
  Translate,
  Bounds,
  pointIntersectsBounds,
  getSmallestBounds,
  mergeBounds,
  getNestedTreeNodeById,
  File,
  updateNestedNode,
  isDirectory,
  getParentTreeNode,
  TreeNode,
  getBoundsSize,
  centerTransformZoom,
  createZeroBounds,
  FSItem,
  getTreeNodePath,
  KeyValue,
  updateNestedNodeTrail,
  getTreeNodeFromPath,
  EMPTY_OBJECT,
  generateUID
} from "tandem-common";
import {
  SyntheticVisibleNode,
  PCEditorState,
  getSyntheticSourceNode,
  getPCNodeDependency,
  getSyntheticNodeById,
  getSyntheticVisibleNodeDocument,
  Frame,
  getSyntheticDocumentDependencyUri,
  getSyntheticVisibleNodeRelativeBounds,
  updateDependencyGraph,
  updateSyntheticVisibleNodeMetadata,
  isSyntheticVisibleNodeMovable,
  isSyntheticVisibleNodeResizable,
  diffTreeNode,
  TreeNodeOperationalTransformType,
  PCSourceTagNames,
  patchTreeNode,
  SyntheticDocument,
  updateSyntheticDocument,
  getFramesByDependencyUri,
  PCVisibleNode,
  PCVariant,
  TreeNodeOperationalTransform,
  getPCNode,
  findInstanceOfPCNode,
  isPCComponentInstance,
  PCComponent
} from "paperclip";
import {
  CanvasToolOverlayMouseMoved,
  CanvasToolOverlayClicked,
  CanvasDroppedItem
} from "../actions";
import { uniq, pull, values, clamp } from "lodash";
import { stat } from "fs";
import {
  replaceDependency,
  PCDependency,
  Dependency,
  DependencyGraph,
  getModifiedDependencies
} from "paperclip";
import { FSSandboxRootState, queueOpenFile, hasFileCacheItem } from "fsbox";

export enum ToolType {
  TEXT,
  POINTER,
  COMPONENT,
  ELEMENT
}

export enum FrameMode {
  PREVIEW = "preview",
  DESIGN = "design"
}

export const REGISTERED_COMPONENT = "REGISTERED_COMPONENT";
export const SNAPSHOT_GAP = 50;

export enum SyntheticVisibleNodeMetadataKeys {
  EDITING_LABEL = "editingLabel",
  EXPANDED = "expanded"
}

export type RegisteredComponent = {
  uri?: string;
  tagName: string;
  template: TreeNode<any>;
};

export type Canvas = {
  backgroundColor: string;
  panning?: boolean;
  translate: Translate;
};

export enum InsertFileType {
  FILE,
  DIRECTORY
}

export type InsertFileInfo = {
  type: InsertFileType;
  directoryId: string;
};

export type GraphHistoryItem = {
  snapshot?: DependencyGraph;
  transforms?: KeyValue<TreeNodeOperationalTransform[]>;
};

export type GraphHistory = {
  index: number;
  items: GraphHistoryItem[];
};

export type Editor = {
  canvas: Canvas;
};

export type EditorWindow = {
  tabUris: string[];
  activeFilePath?: string;
  mousePosition?: Point;
  movingOrResizing?: boolean;
  smooth?: boolean;
  secondarySelection?: boolean;
  fullScreen?: boolean;
  container?: HTMLElement;
};

export enum ConfirmType {
  ERROR,
  WARNING,
  SUCCESS
};

export type Confirm = {
  type: ConfirmType;
  message: string;
};

export type FontFamily = {
  name: string;
};

export type RootState = {
  editorWindows: EditorWindow[];
  mount: Element;
  openFiles: OpenFile[];
  toolType?: ToolType;
  activeEditorFilePath?: string;
  confirm?: Confirm;
  showSidebar?: boolean;

  // TODO - may need to be moved to EditorWindow
  selectedVariant?: PCVariant;

  // TODO - should be actual instances for type safety
  hoveringNodeIds: string[];

  // TODO - this should be actual node instances
  selectedNodeIds: string[];
  fontFamilies?: FontFamily[];
  selectedFileNodeIds: string[];
  selectedComponentVariantName?: string;
  projectDirectory?: Directory;
  insertFileInfo?: InsertFileInfo;
  history: GraphHistory;
  showQuickSearch?: boolean;
  selectedComponentId?: string;
  selectedInheritComponentId?: string;
  queuedScopeSelect?: {
    previousState: RootState;
    scope: SyntheticVisibleNode | SyntheticDocument;
  };
  queuedDndInfo?: CanvasDroppedItem;
} & PCEditorState &
  FSSandboxRootState;

// TODO - change this to Editor
export type OpenFile = {
  temporary: boolean;
  newContent?: Buffer;
  uri: string;
  canvas: Canvas;
};

export const updateRootState = (
  properties: Partial<RootState>,
  root: RootState
) => ({
  ...root,
  ...properties
});

export const deselectRootProjectFiles = (state: RootState) =>
  updateRootState(
    {
      selectedFileNodeIds: []
    },
    state
  );

export const persistRootState = (
  persistPaperclipState: (state: RootState) => RootState,
  state: RootState,
  newSelectionScope?: SyntheticVisibleNode | SyntheticDocument
) => {
  const oldState = state;
  const oldGraph = state.graph;
  state = keepActiveFileOpen(
    updateRootState(persistPaperclipState(state), state)
  );
  const modifiedDeps = getModifiedDependencies(state.graph, oldGraph);
  state = addHistory(oldGraph, state.graph, state);
  state = modifiedDeps.reduce(
    (state, dep: Dependency<any>) => setOpenFileContent(dep, state),
    state
  );
  return state;
};

const getUpdatedSyntheticVisibleNodes = (
  newState: RootState,
  oldState: RootState,
  scope: SyntheticVisibleNode | SyntheticDocument
) => {
  const MAX_DEPTH = 0;
  const oldScope = getSyntheticNodeById(scope.id, oldState.documents);
  const newScope = getSyntheticNodeById(scope.id, newState.documents);

  let newSyntheticVisibleNodes: SyntheticVisibleNode[] = [];
  let model = oldScope;
  diffTreeNode(oldScope, newScope).forEach(ot => {
    const target = getTreeNodeFromPath(ot.nodePath, model);
    model = patchTreeNode([ot], model);

    if (ot.nodePath.length > MAX_DEPTH) {
      return;
    }

    // TODO - will need to check if new parent is not in an instance of a component.
    // Will also need to consider child overrides though.
    if (ot.type === TreeNodeOperationalTransformType.INSERT_CHILD) {
      newSyntheticVisibleNodes.push(ot.child as SyntheticVisibleNode);
    } else if (
      ot.type === TreeNodeOperationalTransformType.SET_PROPERTY &&
      ot.name === "source"
    ) {
      newSyntheticVisibleNodes.push(target);
    }
  });

  return uniq(newSyntheticVisibleNodes);
};

export const queueSelectInsertedSyntheticVisibleNodes = (oldState: RootState, newState: RootState, scope: SyntheticVisibleNode | SyntheticDocument) => {
  return updateRootState({
    queuedScopeSelect: {
      previousState: oldState,
      scope
    }
  }, newState);
};

export const selectInsertedSyntheticVisibleNodes = (
  oldState: RootState,
  newState: RootState,
  scope: SyntheticVisibleNode | SyntheticDocument
) => {
  return setSelectedSyntheticVisibleNodeIds(
    newState,
    ...getUpdatedSyntheticVisibleNodes(newState, oldState, scope).map(
      node => node.id
    )
  );
};

const setOpenFileContent = (dep: Dependency<any>, state: RootState) =>
  updateOpenFile(
    {
      temporary: false,
      newContent: new Buffer(JSON.stringify(dep.content, null, 2), "utf8")
    },
    dep.uri,
    state
  );

const addHistory = (oldGraph: DependencyGraph, newGraph: DependencyGraph, state: RootState) => {
  const items = state.history.items.slice(0, state.history.index);

  const prevSnapshotItem: GraphHistoryItem = getNextHistorySnapshot(items);

  if (!items.length || (prevSnapshotItem && items.length - items.indexOf(prevSnapshotItem) > SNAPSHOT_GAP)) {
    items.push({
      snapshot: oldGraph
    });
  }

  const modifiedDeps = getModifiedDependencies(newGraph, oldGraph);
  const transforms = {};
  for (const dep of modifiedDeps) {
    transforms[dep.uri] = diffTreeNode(oldGraph[dep.uri].content, dep.content, EMPTY_OBJECT);
  }

  return updateRootState({
    history: {
      index: items.length + 1,
      items: [...items, {
        transforms
      }]
    }
  }, state);
};

const getNextHistorySnapshot = (items: GraphHistoryItem[]) => {

  for (let i = items.length; i--;) {
    const prevHistoryItem = items[i];
    if (prevHistoryItem.snapshot) {
      return items[i];
    }
  }
}

const moveDependencyRecordHistory = (
  pos: number,
  state: RootState
): RootState => {
  const newIndex = clamp(state.history.index + pos, 1, state.history.items.length);
  const items = state.history.items.slice(0, newIndex);
  const snapshotItem = getNextHistorySnapshot(items);
  const snapshotIndex = items.indexOf(snapshotItem);
  const transformItems = items.slice(snapshotIndex + 1);

  const graphSnapshot = transformItems.reduce((graph, { transforms }) => {
    const newGraph = {};
    for (const uri in transforms) {
      newGraph[uri] = {
        ...graph[uri],
        content: patchTreeNode(transforms[uri], graph[uri].content)
      };
    }

    return newGraph;
  }, snapshotItem.snapshot);

  state = updateDependencyGraph(graphSnapshot, state);

  state = updateRootState({ history: {
    ...state.history,
    index: newIndex
  }}, state);

  // deselect synthetic nodes if their source is also deleted
  state = setSelectedSyntheticVisibleNodeIds(state, ...state.selectedNodeIds.filter((nodeId) => {
    const { source } = getSyntheticNodeById(nodeId, state.documents);
    return Boolean(getPCNode(source.nodeId, state.graph));
  }));

  return state;
};

const DEFAULT_CANVAS: Canvas = {
  backgroundColor: "#EEE",
  translate: {
    left: 0,
    top: 0,
    zoom: 1
  }
};

export const confirm = (message: string, type: ConfirmType, state: RootState) => updateRootState({ confirm: { message, type }}, state);

export const undo = (root: RootState) => moveDependencyRecordHistory(-1, root);
export const redo = (root: RootState) => moveDependencyRecordHistory(1, root);

export const getOpenFile = (uri: string, state: RootState) =>
  state.openFiles.find(openFile => openFile.uri === uri);

export const getOpenFilesWithContent = (state: RootState) =>
  state.openFiles.filter(openFile => openFile.newContent);

export const updateOpenFileContent = (
  uri: string,
  newContent: Buffer,
  state: RootState
) => {
  return updateOpenFile(
    {
      temporary: false,
      newContent
    },
    uri,
    state
  );
};

export const getActiveEditorWindow = (state: RootState) =>
  getEditorWithActiveFileUri(state.activeEditorFilePath, state);

export const updateOpenFile = (
  properties: Partial<OpenFile>,
  uri: string,
  state: RootState
) => {
  const file = getOpenFile(uri, state);

  if (!file) {
    state = addOpenFile(uri, false, state);
    return updateOpenFile(properties, uri, state);
  }

  const index = state.openFiles.indexOf(file);
  return updateRootState(
    {
      openFiles: arraySplice(state.openFiles, index, 1, {
        ...file,
        ...properties
      })
    },
    state
  );
};

export const openFile = (
  uri: string,
  temporary: boolean,
  secondaryTab: boolean,
  state: RootState
): RootState => {
  let file = getOpenFile(uri, state);
  state = openEditorFileUri(uri, secondaryTab, state);
  if (!file) {
    state = addOpenFile(uri, temporary, state);
    file = getOpenFile(uri, state);
    state = centerEditorCanvas(state, uri);
  }

  if (!hasFileCacheItem(uri, state)) {
    state = queueOpenFile(uri, state);
  }
  return state;
};



// export const setActiveFilePath = (
//   newActiveFilePath: string,
//   root: RootState
// ) => {
//   root = updateRootState({ selectedVariant: null }, root);
//   if (getEditorWithActiveFileUri(newActiveFilePath, root)) {
//     return root;
//   }
//   root = addOpenFile(newActiveFilePath, true, root);
//   root = centerEditorCanvas(root, newActiveFilePath);
//   return root;
// };

export const getEditorWindowWithFileUri = (
  uri: string,
  state: RootState
): EditorWindow => {
  return state.editorWindows.find(window => window.tabUris.indexOf(uri) !== -1);
};

export const getEditorWithActiveFileUri = (
  uri: string,
  state: RootState
): EditorWindow => {
  return state.editorWindows.find(editor => editor.activeFilePath === uri);
};

const createEditorWindow = (tabUris: string[], activeFilePath: string): EditorWindow => ({
  tabUris,
  activeFilePath
});

export const getSyntheticWindowBounds = memoize(
  (uri: string, state: RootState) => {
    const frames = getFramesByDependencyUri(
      uri,
      state.frames,
      state.documents,
      state.graph
    );
    if (!window) return createZeroBounds();
    return mergeBounds(...(frames || EMPTY_ARRAY).map(frame => frame.bounds));
  }
);

export const isImageMimetype = (mimeType: string) => /^image\//.test(mimeType);

export const openEditorFileUri = (uri: string, secondaryTab: boolean, state: RootState): RootState => {
  const editor =
    getEditorWindowWithFileUri(uri, state) || (secondaryTab ? null : state.editorWindows[0]);

  return {
    ...state,
    hoveringNodeIds: [],
    selectedNodeIds: [],
    activeEditorFilePath: uri,
    editorWindows: editor
      ? arraySplice(
          state.editorWindows,
          state.editorWindows.indexOf(editor),
          1,
          {
            ...editor,
            tabUris:
              editor.tabUris.indexOf(uri) === -1
                ? [...editor.tabUris, uri]
                : editor.tabUris,
            activeFilePath: uri
          }
        )
      : [
          ...state.editorWindows,
          createEditorWindow([uri], uri)
        ]
  };
};

export const shiftActiveEditorTab = (
  delta: number,
  state: RootState
): RootState => {
  const editor = getActiveEditorWindow(state);

  // nothing open
  if (!editor) {
    return state;
  }
  const index = editor.tabUris.indexOf(editor.activeFilePath);
  let newIndex = index + delta;
  if (newIndex < 0) {
    newIndex = editor.tabUris.length + delta;
  } else if (newIndex >= editor.tabUris.length) {
    newIndex = -1 + delta;
  }
  newIndex = clamp(newIndex, 0, editor.tabUris.length - 1);

  return openEditorFileUri(editor.tabUris[newIndex], false, state);
};

const removeEditorWindow = (
  { activeFilePath }: EditorWindow,
  state: RootState
): RootState => {
  const editor = getEditorWithActiveFileUri(activeFilePath, state);
  return {
    ...state,
    editorWindows: arraySplice(
      state.editorWindows,
      state.editorWindows.indexOf(editor),
      1
    )
  };
};

export const closeFile = (uri: string, state: RootState): RootState => {
  const editorWindow = getEditorWindowWithFileUri(uri, state);

  if (editorWindow.tabUris.length === 1) {
    state = removeEditorWindow(editorWindow, state);
  } else {
    state = updateEditorWindow(
      {
        tabUris: editorWindow.tabUris.filter(furi => furi !== uri)
      },
      uri,
      state
    );
  }

  state = updateRootState(
    {
      openFiles: state.openFiles.filter(openFile => openFile.uri !== uri)
    },
    state
  );

  state = setNextOpenFile(state);

  return state;
};

export const setNextOpenFile = (state: RootState): RootState => {
  const hasOpenFile = state.openFiles.find(openFile =>
    Boolean(getEditorWithActiveFileUri(openFile.uri, state))
  );

  if (hasOpenFile) {
    return state;
  }
  state = {
    ...state,
    hoveringNodeIds: [],
    selectedNodeIds: []
  };

  if (state.openFiles.length) {
    state = openEditorFileUri(state.openFiles[0].uri, false, state);
  }

  return state;
};

export const removeTemporaryOpenFiles = (state: RootState) => {
  return {
    ...state,
    openFiles: state.openFiles.filter(openFile => !openFile.temporary)
  };
};

export const openSyntheticVisibleNodeOriginFile = (
  node: SyntheticVisibleNode,
  state: RootState
) => {
  let sourceNode = getSyntheticSourceNode(
    node as SyntheticVisibleNode,
    state.graph
  ) as PCVisibleNode | PCComponent;

  if (isPCComponentInstance(sourceNode)) {
    sourceNode = getPCNode(sourceNode.is, state.graph) as PCComponent;
  }

  const uri = getPCNodeDependency(sourceNode.id, state.graph).uri;
  const instance = findInstanceOfPCNode(sourceNode, state.documents.filter(document => getSyntheticDocumentDependencyUri(document, state.graph) === uri));
  state = openFile(uri, false, true, state);
  state = setSelectedSyntheticVisibleNodeIds(state, instance.id);
  state = centerCanvasToSelectedNodes(state);
  return state;
};

export const centerCanvasToSelectedNodes = (state: RootState) => {
  const selectedBounds = getSelectionBounds(state);
  state = centerEditorCanvas(state, state.activeEditorFilePath, selectedBounds);
  return state;
};

export const addOpenFile = (
  uri: string,
  temporary: boolean,
  state: RootState
): RootState => {
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
        temporary,
        canvas: DEFAULT_CANVAS
      }
    ]
  };
};

// export const getInsertedWindowElementIds = (
//   oldWindow: SyntheticWindow,
//   targetFrameId: string,
//   newBrowser: PCEditorState
// ): string[] => {
//   const elementIds = oldWindow.documents
//     .filter(document => !targetFrameId || document.id === targetFrameId)
//     .reduce((nodeIds, oldFrame) => {
//       return [
//         ...nodeIds,
//         ...getInsertedFrameElementIds(oldFrame, newBrowser)
//       ];
//     }, []);
//   const newWindow = newBrowser.windows.find(
//     window => window.location === oldWindow.location
//   );
//   return [
//     ...elementIds,
//     ...newWindow.documents
//       .filter(document => {
//         const isInserted =
//           oldWindow.documents.find(oldFrame => {
//             return oldFrame.id === document.id;
//           }) == null;
//         return isInserted;
//       })
//       .map(document => document.root.id)
//   ];
// };

// export const getInsertedFrameElementIds = (
//   oldFrame: Frame,
//   newBrowser: PCEditorState
// ): string[] => {
//   const newFrame = getFrameById(oldFrame.id, newBrowser);
//   if (!newFrame) {
//     return [];
//   }
//   const oldIds = Object.keys(oldFrame.nativeNodeMap);
//   const newIds = Object.keys(newFrame.nativeNodeMap);
//   return pull(newIds, ...oldIds);
// };

export const keepActiveFileOpen = (state: RootState): RootState => {
  return {
    ...state,
    openFiles: state.openFiles.map(openFile => ({
      ...openFile,
      temporary: false
    }))
  };
};

// export const updateRootStateSyntheticWindowFrame = (
//   documentId: string,
//   properties: Partial<Frame>,
//   root: RootState
// ) => {
//   const window = getFrameWindow(documentId, root);
//   const document = getFrameById(documentId, root);
//   return updateRootState(
//     {
//       browser: updateSyntheticWindow(
//         window.location,
//         {
//           documents: arraySplice(
//             window.documents,
//             window.documents.indexOf(document),
//             1,
//             {
//               ...document,
//               ...properties
//             }
//           )
//         },
//         root
//       )
//     },
//     root
//   );
// };

export const setRootStateSyntheticVisibleNodeExpanded = (
  nodeId: string,
  value: boolean,
  state: RootState
) => {

  const node = getSyntheticNodeById(nodeId, state.documents);
  const document = getSyntheticVisibleNodeDocument(node.id, state.documents);

  state = updateSyntheticDocument(
    setSyntheticVisibleNodeExpanded(node, value, document),
    document,
    state
  );

  return state;
};

const setSyntheticVisibleNodeExpanded = (
  node: SyntheticVisibleNode,
  value: boolean,
  document: SyntheticDocument
): SyntheticVisibleNode => {
  const path = getTreeNodePath(node.id, document);
  const updater = (node: SyntheticVisibleNode) => {
    return {
      ...node,
      metadata: {
        ...node.metadata,
        [SyntheticVisibleNodeMetadataKeys.EXPANDED]: value
      }
    };
  };
  return (value
    ? updateNestedNodeTrail(path, document, updater)
    : updateNestedNode(node, document, updater)) as SyntheticVisibleNode;
};

export const setRootStateSyntheticVisibleNodeLabelEditing = (
  nodeId: string,
  value: boolean,
  state: RootState
) => {
  const node = getSyntheticNodeById(nodeId, state.documents);
  const document = getSyntheticVisibleNodeDocument(node.id, state.documents);
  state = updateSyntheticDocument(
    updateSyntheticVisibleNodeMetadata(
      {
        [SyntheticVisibleNodeMetadataKeys.EDITING_LABEL]: value
      },
      node,
      document
    ),
    document,
    state
  );
  return state;
};

export const setRootStateFileNodeExpanded = (
  nodeId: string,
  value: boolean,
  state: RootState
) => {
  return updateRootState(
    {
      projectDirectory: updateNestedNode(
        getNestedTreeNodeById(nodeId, state.projectDirectory),
        state.projectDirectory,
        (child: FSItem) => ({
          ...child,
          expanded: value
        })
      )
    },
    state
  );
};

export const updateEditorWindow = (
  properties: Partial<EditorWindow>,
  uri: string,
  root: RootState
) => {
  const window = getEditorWindowWithFileUri(uri, root);
  const i = root.editorWindows.indexOf(window);
  return updateRootState(
    {
      editorWindows: arraySplice(root.editorWindows, i, 1, {
        ...window,
        ...properties
      })
    },
    root
  );
};

const INITIAL_ZOOM_PADDING = 50;

export const centerEditorCanvas = (
  state: RootState,
  editorFileUri: string,
  innerBounds?: Bounds,
  smooth: boolean = false,
  zoomOrZoomToFit: boolean | number = true
) => {
  if (!innerBounds) {
    const frames = getFramesByDependencyUri(
      editorFileUri,
      state.frames,
      state.documents,
      state.graph
    );

    if (!frames.length) {
      return state;
    }

    innerBounds = getSyntheticWindowBounds(editorFileUri, state);
  }

  // no windows loaded
  if (
    innerBounds.left +
      innerBounds.right +
      innerBounds.top +
      innerBounds.bottom ===
    0
  ) {
    console.warn(` Cannot center when bounds has no size`);
    return updateOpenFileCanvas(
      {
        translate: { left: 0, top: 0, zoom: 1 }
      },
      editorFileUri,
      state
    );
  }

  const editorWindow = getEditorWindowWithFileUri(editorFileUri, state);
  const openFile = getOpenFile(editorFileUri, state);
  const { container } = editorWindow;

  if (!container) {
    console.warn("cannot center canvas without a container");
    return state;
  }

  const {
    canvas: { translate }
  } = openFile;

  const { width, height } = container.getBoundingClientRect();

  const innerSize = getBoundsSize(innerBounds);

  const centered = {
    left: -innerBounds.left + width / 2 - innerSize.width / 2,
    top: -innerBounds.top + height / 2 - innerSize.height / 2
  };

  const scale =
    typeof zoomOrZoomToFit === "boolean"
      ? Math.min(
          (width - INITIAL_ZOOM_PADDING) / innerSize.width,
          (height - INITIAL_ZOOM_PADDING) / innerSize.height
        )
      : typeof zoomOrZoomToFit === "number"
        ? zoomOrZoomToFit
        : translate.zoom;

  state = updateEditorWindow(
    {
      smooth
    },
    editorFileUri,
    state
  );

  state = updateOpenFileCanvas(
    {
      translate: centerTransformZoom(
        {
          ...centered,
          zoom: 1
        },
        { left: 0, top: 0, right: width, bottom: height },
        Math.min(scale, 1)
      )
    },
    editorFileUri,
    state
  );

  return state;
};

export const updateOpenFileCanvas = (
  properties: Partial<Canvas>,
  uri: string,
  root: RootState
) => {
  const openFile = getOpenFile(uri, root);
  return updateOpenFile(
    {
      canvas: {
        ...openFile.canvas,
        ...properties
      }
    },
    uri,
    root
  );
};

export const setInsertFile = (type: InsertFileType, state: RootState) => {
  const file = getNestedTreeNodeById(
    state.selectedFileNodeIds[0] || state.projectDirectory.id,
    state.projectDirectory
  );
  return updateRootState(
    {
      insertFileInfo: {
        type,
        directoryId: isDirectory(file)
          ? file.id
          : getParentTreeNode(file.id, state.projectDirectory).id
      }
    },
    state
  );
};

export const setTool = (toolType: ToolType, root: RootState) => {
  if (!root.editorWindows.length) {
    return root;
  }
  root = { ...root, selectedComponentId: null };
  root = updateRootState({ toolType }, root);
  root = setSelectedSyntheticVisibleNodeIds(root);
  return root;
};

export const getActiveFrames = (root: RootState): Frame[] =>
  values(root.frames).filter(frame =>
    getActiveEditorWindow(root).activeFilePath === getSyntheticDocumentDependencyUri(
      getSyntheticVisibleNodeDocument(frame.contentNodeId, root.documents),
      root.graph
    )
  );

export const getCanvasTranslate = (canvas: Canvas) => canvas.translate;

export const getScaledMouseCanvasPosition = (
  state: RootState,
  point: Point
) => {
  const canvas = getOpenFile(state.activeEditorFilePath, state).canvas;
  const translate = getCanvasTranslate(canvas);

  const scaledPageX = (point.left - translate.left) / translate.zoom;
  const scaledPageY = (point.top - translate.top) / translate.zoom;
  return { left: scaledPageX, top: scaledPageY };
};

export const getCanvasMouseTargetNodeId = (
  state: RootState,
  event: CanvasToolOverlayMouseMoved | CanvasToolOverlayClicked,
  filter?: (node: TreeNode<any>) => boolean
): string => {

  return getCanvasMouseTargetNodeIdFromPoint(
    state,
    {
      left: event.sourceEvent.pageX,
      top: event.sourceEvent.pageY
    },
    filter
  );
};

export const getCanvasMouseTargetNodeIdFromPoint = (
  state: RootState,
  point: Point,
  filter?: (node: TreeNode<any>) => boolean
): string => {
  const toolType = state.toolType;

  const scaledMousePos = getScaledMouseCanvasPosition(state, point);

  const frame = getFrameFromPoint(scaledMousePos, state);

  if (!frame) return null;
  const contentNode = getSyntheticNodeById(
    frame.contentNodeId,
    state.documents
  );

  const { left: scaledPageX, top: scaledPageY } = scaledMousePos;


  const mouseX = scaledPageX - frame.bounds.left;
  const mouseY = scaledPageY - frame.bounds.top;

  const computedInfo = frame.computed || {};
  const intersectingBounds: Bounds[] = [];
  const intersectingBoundsMap = new Map<Bounds, string>();
  const mouseFramePoint = { left: mouseX, top: mouseY };
  for (const $id in computedInfo) {
    const { bounds } = computedInfo[$id];
    if (
      pointIntersectsBounds(mouseFramePoint, bounds) &&
      // !pointIntersectsBounds(scaledMousePos, deadZone) &&
      (toolType == null ||
        getNestedTreeNodeById($id, contentNode).name !==
          PCSourceTagNames.TEXT) &&
      (!filter || filter(getNestedTreeNodeById($id, contentNode)))
    ) {
      intersectingBounds.push(bounds);
      intersectingBoundsMap.set(bounds, $id);
    }
  }

  if (!intersectingBounds.length) return null;
  const smallestBounds = getSmallestBounds(...intersectingBounds);
  return intersectingBoundsMap.get(smallestBounds);
};

export const getCanvasMouseFrame = (
  state: RootState,
  event: CanvasToolOverlayMouseMoved | CanvasToolOverlayClicked
) => {
  return getFrameFromPoint(
    getScaledMouseCanvasPosition(state, {
      left: event.sourceEvent.pageX,
      top: event.sourceEvent.pageY
    }),
    state
  );
};

export const getFrameFromPoint = (point: Point, state: RootState) => {
  const activeFrames = getActiveFrames(state);
  if (!activeFrames.length) return null;
  for (let j = activeFrames.length; j--; ) {
    const frame = activeFrames[j];
    if (pointIntersectsBounds(point, frame.bounds)) {
      return frame;
    }
  }
};

export const setSelectedSyntheticVisibleNodeIds = (
  root: RootState,
  ...selectionIds: string[]
) => {
  const nodeIds = uniq([...selectionIds]).filter(Boolean);
  root = nodeIds.reduce(
    (state, nodeId) =>
      setRootStateSyntheticVisibleNodeExpanded(nodeId, true, root),
    root
  );
  root = updateRootState(
    {
      selectedNodeIds: nodeIds
    },
    root
  );
  return root;
};

export const setSelectedFileNodeIds = (
  root: RootState,
  ...selectionIds: string[]
) => {
  const nodeIds = uniq([...selectionIds]);
  root = nodeIds.reduce(
    (state, nodeId) => setRootStateFileNodeExpanded(nodeId, true, root),
    root
  );

  root = updateRootState(
    {
      selectedFileNodeIds: nodeIds
    },
    root
  );
  return root;
};

export const setHoveringSyntheticVisibleNodeIds = (
  root: RootState,
  ...selectionIds: string[]
) => {
  return updateRootState(
    {
      hoveringNodeIds: uniq([...selectionIds])
    },
    root
  );
};

// export const updateRootSyntheticPosition = (
//   position: Point,
//   nodeId: string,
//   root: RootState
// ) =>
//   updateRootState(
//     {
//       browser: updateSyntheticItemPosition(position, nodeId, root)
//     },
//     root
//   );

// export const updateRootSyntheticBounds = (
//   bounds: Bounds,
//   nodeId: string,
//   root: RootState
// ) =>
//   updateRootState(
//     {
//       browser: updateSyntheticItemBounds(bounds, nodeId, root)
//     },
//     root
//   );

export const getBoundedSelection = memoize((root: RootState): string[] =>
  root.selectedNodeIds.filter(nodeId =>
    getSyntheticVisibleNodeRelativeBounds(
      getSyntheticNodeById(nodeId, root.documents),
      root.frames
    )
  )
);

export const getSelectionBounds = memoize((root: RootState) =>
  mergeBounds(
    ...getBoundedSelection(root).map(nodeId =>
      getSyntheticVisibleNodeRelativeBounds(
        getSyntheticNodeById(nodeId, root.documents),
        root.frames
      )
    )
  )
);

export const isSelectionMovable = memoize((root: RootState) => {
  return !root.selectedNodeIds.some(nodeId => {
    const node = getSyntheticNodeById(nodeId, root.documents);
    return !isSyntheticVisibleNodeMovable(node);
  });
});

export const isSelectionResizable = memoize((root: RootState) => {
  return !root.selectedNodeIds.some(nodeId => {
    const node = getSyntheticNodeById(nodeId, root.documents);
    return !isSyntheticVisibleNodeResizable(node);
  });
});
