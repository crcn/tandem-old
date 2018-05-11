

import { Action } from "redux";
import { CanvasToolArtboardTitleClicked, CANVAS_TOOL_ARTBOARD_TITLE_CLICKED, PROJECT_LOADED, ProjectLoaded, SYNTHETIC_WINDOW_OPENED, CanvasToolOverlayMouseMoved, SyntheticWindowOpened, PROJECT_DIRECTORY_LOADED, ProjectDirectoryLoaded, FILE_NAVIGATOR_ITEM_CLICKED, FileNavigatorItemClicked, DEPENDENCY_ENTRY_LOADED, DependencyEntryLoaded, DOCUMENT_RENDERED, DocumentRendered, CANVAS_WHEEL, CANVAS_MOUSE_MOVED, CANVAS_MOUSE_CLICKED, WrappedEvent, CanvasToolOverlayClicked, RESIZER_MOUSE_DOWN, ResizerMouseDown, ResizerMoved, RESIZER_MOVED, RESIZER_PATH_MOUSE_STOPPED_MOVING, RESIZER_STOPPED_MOVING, ResizerPathStoppedMoving, RESIZER_PATH_MOUSE_MOVED, ResizerPathMoved, SHORTCUT_A_KEY_DOWN, SHORTCUT_R_KEY_DOWN, SHORTCUT_T_KEY_DOWN, SHORTCUT_ESCAPE_KEY_DOWN, INSERT_TOOL_FINISHED, InsertToolFinished, SHORTCUT_DELETE_KEY_DOWN, CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED, SYNTHETIC_NODES_PASTED, SyntheticNodesPasted, FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED, OPEN_FILE_ITEM_CLICKED, OPEN_FILE_ITEM_CLOSE_CLICKED, OpenFilesItemClick, SAVED_FILE, SavedFile, SAVED_ALL_FILES, RAW_CSS_TEXT_CHANGED, RawCSSTextChanged, PC_LAYER_MOUSE_OVER, PC_LAYER_MOUSE_OUT, PC_LAYER_CLICK, PCLayerMouseOver, PCLayerMouseOut, PCLayerClick, PC_LAYER_EXPAND_TOGGLE_CLICK, PCLayerExpandToggleClick } from "../actions";
import { RootState, setActiveFilePath, updateRootState, updateRootStateSyntheticBrowser, updateRootStateSyntheticWindow, updateRootStateSyntheticWindowDocument, updateCanvas, getCanvasMouseTargetNodeId, setSelection, getSelectionBounds, updateRootSyntheticPosition, getBoundedSelection, updateRootSyntheticBounds, CanvasToolType, getActiveWindow, setCanvasTool, getCanvasMouseDocumentRootId, getDocumentRootIdFromPoint, persistRootStateBrowser, getInsertedWindowElementIds, getInsertedDocumentElementIds, getOpenFile, addOpenFile, upsertOpenFile, removeTemporaryOpenFiles, setNextOpenFile, updateOpenFile, selectRootProjectFile, deselectRootProjectFiles, setHovering, setRootStateNodeExpanded } from "../state";
import { updateSyntheticBrowser, addSyntheticWindow, createSyntheticWindow, SyntheticNode, evaluateDependencyEntry, createSyntheticDocument, getSyntheticWindow, getSyntheticNodeBounds, getSyntheticDocumentWindow, persistSyntheticItemPosition, persistSyntheticItemBounds, SyntheticObjectType, getSyntheticDocumentById, persistNewComponent, persistDeleteSyntheticItems, persistInsertRectangle, persistInsertText, SyntheticDocument, SyntheticBrowser, persistPasteSyntheticNodes, getSyntheticNodeSourceNode, getSyntheticNodeById, SyntheticWindow, getModifiedDependencies, persistRawCSSText, getSyntheticNodeDocument, getSyntheticNodeWindow, expandSyntheticNode } from "../../paperclip";
import { getTeeNodePath, getTreeNodeFromPath, getFilePath, File, getFilePathFromNodePath, EMPTY_OBJECT, TreeNode, StructReference, roundBounds, scaleInnerBounds, moveBounds, keepBoundsAspectRatio, keepBoundsCenter, Bounded, Struct, Bounds, getBoundsSize, shiftBounds, flipPoint, getAttribute, diffArray, getFileFromUri, isDirectory, updateNestedNode, DEFAULT_NAMESPACE, setNodeAttribute, FileAttributeNames, addTreeNodeIds, Directory, getNestedTreeNodeById, isFile, arraySplice, selectFile, deselectAllFiles } from "../../common";
import { difference, pull } from "lodash";
import { select } from "redux-saga/effects";
import { EDITOR_NAMESPACE } from "../../paperclip";

const DEFAULT_RECT_COLOR = "#CCC";
const INSERT_TEXT_OFFSET = {
  left: -5,
  top: -10
};

export const rootReducer = (state: RootState, action: Action): RootState => {
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
      state = selectRootProjectFile(file, false, state);

      if (isDirectory(file)) {
        return updateRootState({
          projectDirectory: updateNestedNode(file, state.projectDirectory, (child) => {
            return setNodeAttribute(child, FileAttributeNames.EXPANDED, !getAttribute(child, FileAttributeNames.EXPANDED));
          })
        }, state);
      } else {
        if (state.activeFilePath === uri) {
          return state;
        }

        state = addOpenFile(uri, true, state);

        state = updateRootState({
          activeFilePath: uri,
          selectedNodeIds: [],
          hoveringNodeIds: [],
        }, state);

        return state;
      }
    }
    case FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED: {
      const { uri } = action as FileNavigatorItemClicked;
      const file = getFileFromUri(uri, state.projectDirectory);
      if (isFile(file)) {
        state = upsertOpenFile(uri, false, state);
        state = updateRootState({
          activeFilePath: uri,
          selectedNodeIds: [],
          hoveringNodeIds: []
        }, state);
      }

      return state;
    }
    case OPEN_FILE_ITEM_CLICKED: {
      const { uri } = action as OpenFilesItemClick;
      return setNextOpenFile(removeTemporaryOpenFiles(updateRootState({
        activeFilePath: uri,
        selectedNodeIds: []
      }, state)));
    }
    case SAVED_FILE: {
      const { uri } = action as SavedFile;
      return updateOpenFile({ newContent: null }, uri, state);
    }
    case SAVED_ALL_FILES: {
      return updateRootState({
        openFiles: state.openFiles.map(openFile => ({
          ...openFile,
          newContent: null
        }))
      }, state);
    }
    case PC_LAYER_MOUSE_OVER: {
      const { nodeId } = action as PCLayerMouseOver;
      state = setHovering(state, nodeId);
      return state;
    }
    case PC_LAYER_MOUSE_OUT: {
      const { nodeId } = action as PCLayerMouseOut;
      state = setHovering(state);
      return state;
    }
    case PC_LAYER_CLICK: {
      const { nodeId } = action as PCLayerClick;
      const window = getSyntheticNodeWindow(nodeId, state.browser);
      state = setActiveFilePath(window.location, state);
      state = setSelection(state, nodeId);
      return state;
    }
    case PC_LAYER_EXPAND_TOGGLE_CLICK: {
      const { nodeId } = action as PCLayerExpandToggleClick;
      const node = getSyntheticNodeById(nodeId, state.browser);
      state = setRootStateNodeExpanded(nodeId, !getAttribute(node, "expanded", EDITOR_NAMESPACE), state);
      return state;
    }
    case OPEN_FILE_ITEM_CLOSE_CLICKED: {
      // TODO - flag confirm remove state
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
      for (const nodeId of state.selectedNodeIds) {
        const itemBounds = getSyntheticNodeBounds(nodeId, state.browser);
        const newBounds = roundBounds(scaleInnerBounds(itemBounds, selectionBounds, moveBounds(selectionBounds, newPoint)));
        state = updateRootSyntheticPosition(newBounds, nodeId, state);
      }

      return state;
    }
    case RESIZER_STOPPED_MOVING: {
      const { point } = action as ResizerMoved;
      const oldGraph = state.browser.graph;

      state = persistRootStateBrowser(browser => {
        return state.selectedNodeIds.reduce((state, nodeId) => persistSyntheticItemPosition(point, nodeId, state), browser)
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

      let targetNodeId: string;

      if (!state.canvas.movingOrResizing) {
        const toolType = state.canvas.toolType;
        if (toolType != null) {
          if (toolType === CanvasToolType.RECTANGLE || toolType === CanvasToolType.TEXT) {
            targetNodeId = getCanvasMouseDocumentRootId(state, action as CanvasToolOverlayMouseMoved);
          }
        } else {
          targetNodeId = getCanvasMouseTargetNodeId(state, action as CanvasToolOverlayMouseMoved);
        }
      }

      state = updateRootState({
        hoveringNodeIds: targetNodeId ? [targetNodeId] : []
      }, state);

      return state;
    };

    // TODO
    case CANVAS_MOUSE_CLICKED: {
      if (state.canvas.toolType != null) {
        return state;
      }

      state = deselectRootProjectFiles(state);

      const { sourceEvent } = action as CanvasToolOverlayClicked;
      if (/textarea|input/i.test((sourceEvent.target as Element).nodeName)) {
        return state;
      }

      // alt key opens up a new link
      const altKey = sourceEvent.altKey;

      // do not allow selection while window is panning (scrolling)
      if (state.canvas.panning || state.canvas.movingOrResizing) return state;

      const targetNodeId = getCanvasMouseTargetNodeId(state, action as CanvasToolOverlayMouseMoved);

      if (!targetNodeId) {
        return state;
      }

      if (!altKey) {
        state = handleArtboardSelectionFromAction(state, targetNodeId, action as CanvasToolOverlayMouseMoved);
        state = updateCanvas({
          secondarySelection: false
        }, state);
        return state;
      }
      return state;
    }
    case RESIZER_PATH_MOUSE_MOVED: {
      state = updateCanvas({
        movingOrResizing: true
      }, state);

      // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
      const newBounds = getResizeActionBounds(action as ResizerPathMoved);
      for (const nodeId of getBoundedSelection(state)) {
        state = updateRootSyntheticBounds(getNewSyntheticNodeBounds(newBounds, nodeId, state), nodeId, state);
      }
      return state;
    }
    case RESIZER_PATH_MOUSE_STOPPED_MOVING: {
      state = updateCanvas({
        movingOrResizing: false
      }, state);

      // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
      const newBounds = getResizeActionBounds(action as ResizerPathStoppedMoving);

      state = persistRootStateBrowser(browser => {
        return state.selectedNodeIds.reduce((browserState, nodeId) => persistSyntheticItemBounds(getNewSyntheticNodeBounds(newBounds, nodeId, state), nodeId, browserState), state.browser)
      }, state);

      return state;
    }
    case RAW_CSS_TEXT_CHANGED: {
      const { value: cssText } = action as RawCSSTextChanged;
      return persistRootStateBrowser(browser => {
        return state.selectedNodeIds.reduce((browserState, nodeId) => persistRawCSSText(cssText, nodeId, browserState), state.browser)
      }, state);
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
          state = persistRootStateBrowser(browser => persistNewComponent(bounds, state.activeFilePath, browser), state);
          const newActiveWindow = getActiveWindow(state);
          const newDocument = newActiveWindow.documents[newActiveWindow.documents.length - 1];
          state = setSelection(state, newDocument.root.id);
          return state;
        }
        case CanvasToolType.RECTANGLE: {
          const nodeId = getDocumentRootIdFromPoint(bounds, state);
          if (!nodeId) {
            console.warn(`Cannot insert rectangle off canvas`);
            return state;
          }
          const document = getSyntheticNodeDocument(nodeId, state.browser);
          state = persistRootStateBrowser(browser => {
            return persistInsertRectangle({
              ...shiftBounds(bounds, flipPoint(document.bounds)),
              ...getBoundsSize(bounds),
              background: DEFAULT_RECT_COLOR,
              position: "absolute"
            }, document.id, browser)
          }, state);
          state = setSelection(state, ...getInsertedDocumentElementIds(document, state.browser));
          return state;
        }
        case CanvasToolType.TEXT: {
          const nodeId = getDocumentRootIdFromPoint(bounds, state);
          if (!nodeId) {
            console.warn(`Cannot insert rectangle off canvas`);
            return state;
          }
          const document = getSyntheticNodeDocument(nodeId, state.browser);

          state = persistRootStateBrowser(browser => {
            return persistInsertText({
              ...shiftBounds(shiftBounds(bounds, flipPoint(document.bounds)), INSERT_TEXT_OFFSET),
              display: "inline-block",
              position: "relative"
            }, "double click to edit", document.id, browser);
          }, state);

          state = setSelection(state, ...getInsertedDocumentElementIds(document, state.browser));
          return state;
        }
      }
    }
  }

  return state;
};

const getNewSyntheticNodeBounds = (newBounds: Bounds, nodeId: string, state: RootState) => {
  const currentBounds = getSelectionBounds(state);
  const innerBounds = getSyntheticNodeBounds(nodeId, state.browser);
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
      const selection = state.selectedNodeIds;
      return setSelection(persistRootStateBrowser(browser => persistDeleteSyntheticItems(selection, state.browser), state));
    }
  }

  return state;
};

const clipboardReducer = (state: RootState, action: Action) => {
  switch(action.type) {
    case SYNTHETIC_NODES_PASTED: {
      const { syntheticNodes } = action as SyntheticNodesPasted;

      let targetSourceNode: TreeNode;

      if (state.selectedNodeIds.length) {
        const nodeId = state.selectedNodeIds[0];
        targetSourceNode = getSyntheticNodeSourceNode(getSyntheticNodeById(nodeId, state.browser), state.browser.graph);
      } else {
        targetSourceNode = state.browser.graph[state.activeFilePath].content;
      }

      const oldWindow = getActiveWindow(state);

      state = persistRootStateBrowser(browser => persistPasteSyntheticNodes(state.activeFilePath, targetSourceNode.id, syntheticNodes, browser), state);
      state = setSelection(state, ...getInsertedWindowElementIds(oldWindow, state.browser));
    }
  }

  return state;
};

const handleArtboardSelectionFromAction = <T extends { sourceEvent: React.MouseEvent<any> }>(state: RootState, nodeId: string, event: T) => {
  const { sourceEvent } = event;
  state = setRootStateNodeExpanded(nodeId, true, state);
  return setSelection(state, nodeId);
}

// const resizeFullScreenArtboard = (state: RootState, width: number, height: number) => {
//   const workspace = getSelectedWorkspace(state);
//   if (workspace.stage.fullScreen && workspace.stage.container) {

//     // TODO - do not all getBoundingClientRect here. Dimensions need to be
//     return updateArtboardSize(state, workspace.stage.fullScreen.documentId, width, height);
//   }
//   return state;
// }

