

import { Action } from "redux";
import { CanvasToolArtboardTitleClicked, CANVAS_TOOL_ARTBOARD_TITLE_CLICKED, PROJECT_LOADED, ProjectLoaded, SYNTHETIC_WINDOW_OPENED, CanvasToolOverlayMouseMoved, SyntheticWindowOpened, PROJECT_DIRECTORY_LOADED, ProjectDirectoryLoaded, FILE_NAVIGATOR_ITEM_CLICKED, FileNavigatorItemClicked, DEPENDENCY_ENTRY_LOADED, DependencyEntryLoaded, DOCUMENT_RENDERED, DocumentRendered, CANVAS_WHEEL, CANVAS_MOUSE_MOVED, CANVAS_MOUSE_CLICKED, WrappedEvent, CanvasToolOverlayClicked, RESIZER_MOUSE_DOWN, ResizerMouseDown, ResizerMoved, RESIZER_MOVED, RESIZER_PATH_MOUSE_STOPPED_MOVING, RESIZER_STOPPED_MOVING, ResizerPathStoppedMoving, RESIZER_PATH_MOUSE_MOVED, ResizerPathMoved, SHORTCUT_A_KEY_DOWN, SHORTCUT_R_KEY_DOWN, SHORTCUT_T_KEY_DOWN, SHORTCUT_ESCAPE_KEY_DOWN, INSERT_TOOL_FINISHED, InsertToolFinished, SHORTCUT_DELETE_KEY_DOWN, CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED, SYNTHETIC_NODES_PASTED, SyntheticNodesPasted, FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED, OPEN_FILE_ITEM_CLICKED, OPEN_FILE_ITEM_CLOSE_CLICKED, OpenFilesItemClick } from "../actions";
import { RootState, setActiveFilePath, updateRootState, updateRootStateSyntheticBrowser, updateRootStateSyntheticWindow, updateRootStateSyntheticWindowDocument, updateCanvas, getCanvasMouseNodeTargetReference, setSelection, getSelectionBounds, updateRootSyntheticPosition, getBoundedSelection, updateRootSyntheticBounds, CanvasToolType, getActiveWindow, setCanvasTool, getCanvasMouseDocumentReference, getDocumentReferenceFromPoint } from "../state";
import { updateSyntheticBrowser, addSyntheticWindow, createSyntheticWindow, SyntheticNode, evaluateDependencyEntry, createSyntheticDocument, getSyntheticWindow, getSyntheticItemBounds, getSyntheticDocumentWindow, persistSyntheticItemPosition, persistSyntheticItemBounds, SyntheticObjectType, getSyntheticDocumentById, persistNewComponent, persistDeleteSyntheticItems, persistInsertRectangle, persistInsertText, SyntheticDocument, SyntheticBrowser, persistPasteSyntheticNodes, getSyntheticNodeSourceNode, getSyntheticNodeById, SyntheticWindow } from "../../paperclip";
import { getTeeNodePath, getTreeNodeFromPath, getFilePath, File, getFilePathFromNodePath, EMPTY_OBJECT, TreeNode, StructReference, roundBounds, scaleInnerBounds, moveBounds, keepBoundsAspectRatio, keepBoundsCenter, Bounded, Struct, Bounds, getBoundsSize, shiftBounds, flipPoint, getAttribute, diffArray, getFileFromUri, isDirectory, updateNestedNode, DEFAULT_NAMESPACE, setNodeAttribute, FileAttributeNames, addTreeNodeIds, Directory, getNestedTreeNodeById, isFile, arraySplice } from "../../common";
import { difference, pull } from "lodash";

const DEFAULT_RECT_COLOR = "#CCC";
const INSERT_TEXT_OFFSET = {
  left: -5,
  top: -10
};

export const rootReducer = (state: RootState, action: Action) => {
  state = canvasReducer(state, action);
  state = shortcutReducer(state, action);
  state = clipboardReducer(state, action);
  switch(action.type) {
    case PROJECT_DIRECTORY_LOADED: {
      const { directory } = action as ProjectDirectoryLoaded;
      return updateRootState({ projectDirectory: addTreeNodeIds(directory) }, state);
    }
    case FILE_NAVIGATOR_ITEM_CLICKED: {
      const { uri } = action as FileNavigatorItemClicked;
      const file = getFileFromUri(uri, state.projectDirectory);
      if (isDirectory(file)) {
        return updateRootState({
          projectDirectory: updateNestedNode(file, state.projectDirectory, (child) => {
            return setNodeAttribute(child, FileAttributeNames.EXPANDED, !getAttribute(child, FileAttributeNames.EXPANDED));
          })
        }, state);
      } else {
        const uri = getAttribute(file, FileAttributeNames.URI);

        if (state.openFiles.find((openFile) => openFile.uri === uri)) {
          return state;
        }

        return updateRootState({
          activeFilePath: getAttribute(file, FileAttributeNames.URI),
          selectionReferences: [],
          hoveringReferences: [],
          openFiles: [
            ...state.openFiles.filter(openFile => openFile.temporary === false),
            {
              uri,
              temporary: true
            }
          ]
        }, state);
      }
    }
    case FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED: {
      const { uri } = action as FileNavigatorItemClicked;
      const file = getFileFromUri(uri, state.projectDirectory);
      if (isFile(file)) {
        const i = state.openFiles.findIndex(openFile => openFile.uri === uri);
        const openFile = {
          uri,
          temporary: false
        };

        return updateRootState({
          activeFilePath: uri,
          selectionReferences: [],
          hoveringReferences: [],
          openFiles: ~i ? arraySplice(state.openFiles, i, 1, openFile) : [
            ...state.openFiles.filter(openFile => openFile.temporary === false),
            openFile
          ]
        }, state);
      }

      return state;
    }
    case OPEN_FILE_ITEM_CLICKED: {
      const { uri } = action as OpenFilesItemClick;
      return setNextOpenFile(updateRootState({
        openFiles: state.openFiles.filter(openFile => !openFile.temporary),
        activeFilePath: uri,
        selectionReferences: []
      }, state));
    }
    case OPEN_FILE_ITEM_CLOSE_CLICKED: {
      const { uri } = action as OpenFilesItemClick;
      return setNextOpenFile(updateRootState({
        openFiles: state.openFiles.filter(openFile => openFile.uri !== uri),
      }, state));
    }
    case DEPENDENCY_ENTRY_LOADED: {
      const { entry, graph } = action as DependencyEntryLoaded;

      state = updateRootStateSyntheticBrowser({
        graph: {
          ...(state.browser.graph || EMPTY_OBJECT),
          ...graph
        }
      }, state);

      const documents = evaluateDependencyEntry({ entry, graph }).documentNodes.map(root => {
        return createSyntheticDocument(root, graph);
      });

      const existingWindow = state.browser.windows.find(window => window.location === entry.uri);

      if (!existingWindow) {
        state = updateRootStateSyntheticBrowser({
          windows: [
            ...state.browser.windows,
            createSyntheticWindow(entry.uri)
          ]
        }, state);
      }

      return updateRootStateSyntheticWindow(entry.uri, {
        documents,
      }, state);
    }
    case DOCUMENT_RENDERED: {
      const { info, documentId, nativeMap } = action as DocumentRendered;
      return updateRootStateSyntheticWindowDocument(documentId, {
        nativeNodeMap: nativeMap,
        computed: info
      }, state);
    }
  }
  return state;
};

export const canvasReducer = (state: RootState, action: Action) => {
  switch(action.type) {
    case RESIZER_MOVED: {
      const { point: newPoint } = action as ResizerMoved;
      state = updateCanvas({
        movingOrResizing: true
      }, state);

      const translate = state.canvas.translate;

      const selectionBounds = getSelectionBounds(state);
      for (const item of state.selectionReferences) {
        const itemBounds = getSyntheticItemBounds(item, state.browser);
        const newBounds = roundBounds(scaleInnerBounds(itemBounds, selectionBounds, moveBounds(selectionBounds, newPoint)));
        state = updateRootSyntheticPosition(newBounds, item, state);
      }

      return state;
    }
    case RESIZER_STOPPED_MOVING: {
      const { point } = action as ResizerMoved;
      state = updateRootState({
        browser: state.selectionReferences.reduce((state, ref) => persistSyntheticItemPosition(point, ref, state), state.browser)
      }, state);
      state = updateCanvas({
        movingOrResizing: false
      }, state);
      return state;
    }

    case CANVAS_MOUSE_MOVED: {


      const { sourceEvent: { pageX, pageY }} = action as WrappedEvent<React.MouseEvent<any>>;
      state = updateCanvas({ mousePosition: { left: pageX, top: pageY }}, state);

      // TODO - in the future, we'll probably want to be able to highlight hovered nodes as the user is moving an element around to indicate where
      // they can drop the element.

      let targetRef: StructReference<any>;

      if (!state.canvas.movingOrResizing) {
        const toolType = state.canvas.toolType;
        if (toolType != null) {
          if (toolType === CanvasToolType.RECTANGLE || toolType === CanvasToolType.TEXT) {
            targetRef = getCanvasMouseDocumentReference(state, action as CanvasToolOverlayMouseMoved);
          }
        } else {
          targetRef = getCanvasMouseNodeTargetReference(state, action as CanvasToolOverlayMouseMoved);
        }
      }

      state = updateRootState({
        hoveringReferences: targetRef ? [targetRef] : []
      }, state);

      return state;
    };

    // TODO
    case CANVAS_MOUSE_CLICKED: {

      if (state.canvas.toolType != null) {
        return state;
      }
      const { sourceEvent } = action as CanvasToolOverlayClicked;
      if (/textarea|input/i.test((sourceEvent.target as Element).nodeName)) {
        return state;
      }

      // alt key opens up a new link
      const altKey = sourceEvent.altKey;

      // do not allow selection while window is panning (scrolling)
      if (state.canvas.panning || state.canvas.movingOrResizing) return state;

      const targetRef = getCanvasMouseNodeTargetReference(state, action as CanvasToolOverlayMouseMoved);

      if (!targetRef) {
        return state;
      }

      if (!altKey) {
        state = handleArtboardSelectionFromAction(state, targetRef, action as CanvasToolOverlayMouseMoved);
        state = updateCanvas({
          secondarySelection: false
        }, state);
        return state;
      }
      return state;
    }
    case RESIZER_PATH_MOUSE_MOVED: {
      state = updateCanvas({
        movingOrResizing: false
      }, state);

      // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
      const newBounds = getResizeActionBounds(action as ResizerPathMoved);
      for (const item of getBoundedSelection(state)) {
        state = updateRootSyntheticBounds(getNewSyntheticItemBounds(newBounds, item, state), item, state);
      }
      return state;
    }
    case RESIZER_PATH_MOUSE_STOPPED_MOVING: {
      state = updateCanvas({
        movingOrResizing: false
      }, state);

      // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
      const newBounds = getResizeActionBounds(action as ResizerPathStoppedMoving);
      state = updateRootState({
        browser: state.selectionReferences.reduce((browserState, ref) => persistSyntheticItemBounds(getNewSyntheticItemBounds(newBounds, ref, state), ref, browserState), state.browser)
      }, state);

      return state;
    }
    case CANVAS_TOOL_ARTBOARD_TITLE_CLICKED: {
      const { documentId, sourceEvent } = action as CanvasToolArtboardTitleClicked;
      state = updateCanvas({ smooth: false }, state);
      return handleArtboardSelectionFromAction(state, getSyntheticDocumentById(documentId, state.browser), action as CanvasToolArtboardTitleClicked);
    }
    case CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED: {
      return setSelection(state);
    }
    case INSERT_TOOL_FINISHED: {
      const { bounds } = action as InsertToolFinished;
      const toolType = state.canvas.toolType;
      state = updateCanvas({
        toolType: null
      }, state);

      switch(toolType) {
        case CanvasToolType.ARTBOARD: {
          state = keepActiveFileOpen(updateRootStateSyntheticBrowser(persistNewComponent(bounds, state.activeFilePath, state.browser), state));
          const newActiveWindow = getActiveWindow(state);
          const newDocument = newActiveWindow.documents[newActiveWindow.documents.length - 1];
          state = setSelection(state, newDocument);
          return state;
        }
        case CanvasToolType.RECTANGLE: {
          const document = getDocumentReferenceFromPoint(bounds, state);
          if (!document) {
            console.warn(`Cannot insert rectangle off canvas`);
            return state;
          }
          state = updateRootStateSyntheticBrowser(persistInsertRectangle({
            ...shiftBounds(bounds, flipPoint(document.bounds)),
            ...getBoundsSize(bounds),
            background: DEFAULT_RECT_COLOR,
            position: "absolute"
          }, document.id, state.browser), state);

          state = setSelection(state, ...getInsertedDocumentElementRefs(document, state.browser));
          return state;
        }
        case CanvasToolType.TEXT: {
          const document = getDocumentReferenceFromPoint(bounds, state);
          if (!document) {
            console.warn(`Cannot insert rectangle off canvas`);
            return state;
          }

          state = updateRootStateSyntheticBrowser(persistInsertText({
            ...shiftBounds(shiftBounds(bounds, flipPoint(document.bounds)), INSERT_TEXT_OFFSET),
            display: "inline-block",
            position: "relative"
          }, "double click to edit", document.id, state.browser), state);

          state = setSelection(state, ...getInsertedDocumentElementRefs(document, state.browser));
          return state;
        }
      }
    }
  }

  return state;
};

const setNextOpenFile = (state: RootState): RootState => {
  const hasOpenFile = state.openFiles.find(openFile => state.activeFilePath === openFile.uri);
  if (hasOpenFile) {
    return state;
  }
  return {
    ...state,
    activeFilePath: state.openFiles.length ? state.openFiles[0].uri : null
  };
};

const keepActiveFileOpen = (state: RootState): RootState => {
  return {
    ...state,
    openFiles: state.openFiles.map(openFile => ({
      ...openFile,
      temporary: false
    }))
  }
}

const getInsertedWindowRefs = (oldWindow: SyntheticWindow, newBrowser: SyntheticBrowser): StructReference<any>[] => {
  const elementRefs = oldWindow.documents.reduce((refs, oldDocument) => {
    return [...refs, ...getInsertedDocumentElementRefs(oldDocument, newBrowser)];
  }, []);
  const newWindow = newBrowser.windows.find(window => window.location === oldWindow.location);
  return [
    ...elementRefs,
    ...newWindow.documents.filter(document => {
      const isInserted = oldWindow.documents.find(oldDocument => {
        return oldDocument.id === document.id
      }) == null
      return isInserted;
    })
  ];
};

const getInsertedDocumentElementRefs = (oldDocument: SyntheticDocument, newBrowser: SyntheticBrowser): StructReference<any>[] => {
  const newDocument = getSyntheticDocumentById(oldDocument.id, newBrowser);
  const oldIds = Object.keys(oldDocument.nativeNodeMap);
  const newIds = Object.keys(newDocument.nativeNodeMap);
  return pull(newIds, ...oldIds).map(id => ({
    id,
    type: SyntheticObjectType.ELEMENT
  }))
};

const getNewSyntheticItemBounds = (newBounds: Bounds, item: Struct, state: RootState) => {
  const currentBounds = getSelectionBounds(state);
  const innerBounds = getSyntheticItemBounds(item, state.browser);
  return scaleInnerBounds(innerBounds, currentBounds, newBounds);
};

const getResizeActionBounds = (action: ResizerPathMoved|ResizerMoved) => {
  let { anchor, originalBounds, newBounds, sourceEvent } = action as ResizerPathMoved;

  const keepAspectRatio = sourceEvent.shiftKey;
  const keepCenter      = sourceEvent.altKey;

  if (keepCenter) {

    // TODO - need to test. this might not work
    newBounds = keepBoundsCenter(newBounds, originalBounds, anchor);
  }

  if (keepAspectRatio) {
    newBounds = keepBoundsAspectRatio(newBounds, originalBounds, anchor, keepCenter ? { left: 0.5, top: 0.5 } : anchor);
  }

  return newBounds;
}

const shortcutReducer = (state: RootState, action: Action) => {
  switch(action.type) {
    case SHORTCUT_A_KEY_DOWN: {
      return setCanvasTool(CanvasToolType.ARTBOARD, state);
    }
    case SHORTCUT_R_KEY_DOWN: {
      return setCanvasTool(CanvasToolType.RECTANGLE, state);
    }
    case SHORTCUT_T_KEY_DOWN: {
      return setCanvasTool(CanvasToolType.TEXT, state);
    }
    case SHORTCUT_ESCAPE_KEY_DOWN: {
      if (state.canvas.toolType) {
        return updateCanvas({
          toolType: null
        }, state);
      } else {
        return setSelection(state);
      }
    }
    case SHORTCUT_DELETE_KEY_DOWN: {
      const selection = state.selectionReferences;
      state = updateRootStateSyntheticBrowser(persistDeleteSyntheticItems(selection, state.browser), state);
      return keepActiveFileOpen(setSelection(state));
    }
  }

  return state;
};

const clipboardReducer = (state: RootState, action: Action) => {
  switch(action.type) {
    case SYNTHETIC_NODES_PASTED: {
      const { syntheticNodes } = action as SyntheticNodesPasted;

      let targetSourceNode: TreeNode;

      if (state.selectionReferences.length) {
        const ref = state.selectionReferences[0];
        targetSourceNode = ref.type === SyntheticObjectType.DOCUMENT ? getSyntheticDocumentById(ref.id, state.browser).root : getSyntheticNodeSourceNode(getSyntheticNodeById(ref.id, state.browser), state.browser.graph);
      } else {
        targetSourceNode = state.browser.graph[state.activeFilePath].content;
      }

      const oldWindow = getActiveWindow(state);

      state = updateRootStateSyntheticBrowser(persistPasteSyntheticNodes(state.activeFilePath, targetSourceNode.id, syntheticNodes, state.browser), state);

      state = keepActiveFileOpen(setSelection(state, ...getInsertedWindowRefs(oldWindow, state.browser)));
    }
  }

  return state;
};

const handleArtboardSelectionFromAction = <T extends { sourceEvent: React.MouseEvent<any> }>(state: RootState, ref: StructReference<any>, event: T) => {
  const { sourceEvent } = event;
  return setSelection(state, ref);
}

// const resizeFullScreenArtboard = (state: RootState, width: number, height: number) => {
//   const workspace = getSelectedWorkspace(state);
//   if (workspace.stage.fullScreen && workspace.stage.container) {

//     // TODO - do not all getBoundingClientRect here. Dimensions need to be
//     return updateArtboardSize(state, workspace.stage.fullScreen.documentId, width, height);
//   }
//   return state;
// }

