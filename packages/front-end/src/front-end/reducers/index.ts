

import { Action } from "redux";
import * as path from "path";
import { CanvasToolArtboardTitleClicked, NEW_FILE_ADDED, PC_LAYER_EDIT_LABEL_BLUR, CANVAS_TOOL_ARTBOARD_TITLE_CLICKED, PROJECT_LOADED, PC_LAYER_DOUBLE_CLICK, ProjectLoaded, SYNTHETIC_WINDOW_OPENED, CanvasToolOverlayMouseMoved, SyntheticWindowOpened, PROJECT_DIRECTORY_LOADED, ProjectDirectoryLoaded, FILE_NAVIGATOR_ITEM_CLICKED, FileNavigatorItemClicked, DEPENDENCY_ENTRY_LOADED, DependencyEntryLoaded, DOCUMENT_RENDERED, DocumentRendered, CANVAS_WHEEL, CANVAS_MOUSE_MOVED, CANVAS_MOUSE_CLICKED, WrappedEvent, CanvasToolOverlayClicked, RESIZER_MOUSE_DOWN, ResizerMouseDown, ResizerMoved, RESIZER_MOVED, RESIZER_PATH_MOUSE_STOPPED_MOVING, RESIZER_STOPPED_MOVING, ResizerPathStoppedMoving, RESIZER_PATH_MOUSE_MOVED, ResizerPathMoved, SHORTCUT_A_KEY_DOWN, SHORTCUT_R_KEY_DOWN, SHORTCUT_T_KEY_DOWN, SHORTCUT_ESCAPE_KEY_DOWN, INSERT_TOOL_FINISHED, InsertToolFinished, SHORTCUT_DELETE_KEY_DOWN, CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED, SYNTHETIC_NODES_PASTED, SyntheticNodesPasted, FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED, OPEN_FILE_ITEM_CLICKED, OPEN_FILE_ITEM_CLOSE_CLICKED, OpenFilesItemClick, SAVED_FILE, SavedFile, SAVED_ALL_FILES, RAW_CSS_TEXT_CHANGED, RawCSSTextChanged, PC_LAYER_MOUSE_OVER, PC_LAYER_MOUSE_OUT, PC_LAYER_CLICK, PC_LAYER_EXPAND_TOGGLE_CLICK, TreeLayerLabelChanged, TreeLayerClick, TreeLayerDroppedNode, TreeLayerExpandToggleClick, TreeLayerMouseOut, FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED, TreeLayerMouseOver, PC_LAYER_DROPPED_NODE, FILE_NAVIGATOR_NEW_FILE_CLICKED, FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED, NewFileAdded, FILE_NAVIGATOR_DROPPED_ITEM, FileNavigatorDroppedItem, SHORTCUT_UNDO_KEY_DOWN, SHORTCUT_REDO_KEY_DOWN, SLOT_TOGGLE_CLICK, PC_LAYER_LABEL_CHANGED, NATIVE_NODE_TYPE_CHANGED, TEXT_VALUE_CHANGED, TextValueChanged, NativeNodeTypeChanged, SHORTCUT_QUICK_SEARCH_KEY_DOWN, QUICK_SEARCH_ITEM_CLICKED, QuickSearchItemClicked, QUICK_SEARCH_BACKGROUND_CLICK } from "../actions";
import { RootState, setActiveFilePath, updateRootState, updateRootStateSyntheticBrowser, updateRootStateSyntheticWindow, updateRootStateSyntheticWindowDocument, updateCanvas, getCanvasMouseTargetNodeId, setSelectedSyntheticNodeIds, getSelectionBounds, updateRootSyntheticPosition, getBoundedSelection, updateRootSyntheticBounds, CanvasToolType, getActiveWindow, setCanvasTool, getCanvasMouseDocumentRootId, getDocumentRootIdFromPoint, persistRootStateBrowser, getInsertedWindowElementIds, getInsertedDocumentElementIds, getOpenFile, addOpenFile, upsertOpenFile, removeTemporaryOpenFiles, setNextOpenFile, updateOpenFile, deselectRootProjectFiles, setHoveringSyntheticNodeIds, setRootStateSyntheticNodeExpanded, setSelectedFileNodeIds, InsertFileType, setInsertFile, undo, redo, openSyntheticWindow, openSyntheticNodeOriginWindow, setRootStateSyntheticNodeLabelEditing } from "../state";
import { updateSyntheticBrowser, addSyntheticWindow, createSyntheticWindow, SyntheticNode, evaluateDependencyEntry, createSyntheticDocument, getSyntheticWindow, getSyntheticNodeBounds, getSyntheticDocumentWindow, persistSyntheticItemPosition, persistSyntheticItemBounds, SyntheticObjectType, getSyntheticDocumentById, persistNewComponent, persistDeleteSyntheticItems, persistInsertRectangle, persistInsertText, SyntheticDocument, SyntheticBrowser, persistPasteSyntheticNodes, getSyntheticSourceNode, getSyntheticNodeById, SyntheticWindow, getModifiedDependencies, persistRawCSSText, getSyntheticNodeDocument, getSyntheticNodeWindow, expandSyntheticNode, persistMoveSyntheticNode, getSyntheticOriginSourceNodeUri, getSyntheticOriginSourceNode, findSourceSyntheticNode, persistToggleSlotContainer, updateSyntheticNodeAttributes, persistChangeNodeLabel, persistChangeNodeType, persistTextValue } from "../../paperclip";
import { getTreeNodePath, getTreeNodeFromPath, getFilePath, File, getFilePathFromNodePath, EMPTY_OBJECT, TreeNode, StructReference, roundBounds, scaleInnerBounds, moveBounds, keepBoundsAspectRatio, keepBoundsCenter, Bounded, Struct, Bounds, getBoundsSize, shiftBounds, flipPoint, getAttribute, diffArray, getFileFromUri, isDirectory, updateNestedNode, DEFAULT_NAMESPACE, setNodeAttribute, FileAttributeNames, addTreeNodeIds, Directory, getNestedTreeNodeById, isFile, arraySplice, getParentTreeNode, appendChildNode, removeNestedTreeNode, resizeBounds, updateNestedNodeTrail } from "../../common";
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
      const { node } = action as FileNavigatorItemClicked;
      const uri = getAttribute(node, FileAttributeNames.URI);
      const file = node as File;
      state = setSelectedFileNodeIds(state, file.id);
      state = setFileExpanded(node, true, state);

      if (!isDirectory(file)) {
        state = setActiveFilePath(uri, state);
        return state;
      }

      return state;
    }
    case QUICK_SEARCH_ITEM_CLICKED: {
      const { file } = action as QuickSearchItemClicked;
      const uri = getAttribute(file, FileAttributeNames.URI);
      state = setSelectedFileNodeIds(state, file.id);
      state = setActiveFilePath(uri, state);
      state = upsertOpenFile(uri, false, state);
      state = updateRootState({ showQuickSearch: false }, state);
      return state;
    }
    case QUICK_SEARCH_BACKGROUND_CLICK: {
      return state = updateRootState({ showQuickSearch: false }, state);
    }
    case FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED: {
      const { node } = action as FileNavigatorItemClicked;
      state = setFileExpanded(node, !getAttribute(node, "expanded"), state);
      return state;
    }
    case FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED: {
      const { node } = action as FileNavigatorItemClicked;
      const uri = getAttribute(node, FileAttributeNames.URI);
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
    case FILE_NAVIGATOR_NEW_FILE_CLICKED: {
      return setInsertFile(InsertFileType.FILE, state);
    }
    case FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED: {
      return setInsertFile(InsertFileType.DIRECTORY, state);
    }
    case FILE_NAVIGATOR_DROPPED_ITEM: {
      const { node, targetNode } = action as FileNavigatorDroppedItem;
      const parent = getParentTreeNode(node.id, state.projectDirectory);
      const parentUri = getAttribute(parent, FileAttributeNames.URI);
      const nodeUri = getAttribute(node, FileAttributeNames.URI);
      state = updateRootState({
        projectDirectory: updateNestedNode(parent, state.projectDirectory, (parent) => removeNestedTreeNode(node, parent))
      }, state);

      const targetDir = targetNode.name !== "file" ? targetNode : getParentTreeNode(targetNode.id, state.projectDirectory);
      const targetUri = getAttribute(targetDir, FileAttributeNames.URI);
      state = updateRootState({
        projectDirectory: updateNestedNode(targetDir, state.projectDirectory, (targetNode) => {
          return appendChildNode(
            setNodeAttribute(node, FileAttributeNames.URI, nodeUri.replace(parentUri, targetUri)),
            targetNode
          )
        })
      }, state)

      return state;
    }
    case NEW_FILE_ADDED: {
      const { directoryId, basename, fileType } = action as NewFileAdded;
      const directory = getNestedTreeNodeById(directoryId, state.projectDirectory);
      let uri = getAttribute(directory, FileAttributeNames.URI) + basename;
      if (fileType === "directory") {
        uri += "/";
      }
      state = updateRootState({
        insertFileInfo: null,
        projectDirectory: updateNestedNode(directory, state.projectDirectory, (dir) => {
          return {
            ...dir,
            children: [
              ...dir.children,
              {
                name: fileType,
                id: uri,
                attributes: {
                  [DEFAULT_NAMESPACE]: {
                    [FileAttributeNames.URI]: uri,
                    [FileAttributeNames.BASENAME]: basename,
                  }
                },
                children: []
              }
            ]
          }
        })
      }, state);
      return state;
    }
    case OPEN_FILE_ITEM_CLICKED: {
      const { uri } = action as OpenFilesItemClick;
      if (state.activeFilePath === uri) {
        return state;
      }
      return setNextOpenFile(removeTemporaryOpenFiles(updateRootState({
        activeFilePath: uri,
        selectedNodeIds: [],
        hoveringNodeIds: []
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
      const { node } = action as TreeLayerMouseOver;
      state = setHoveringSyntheticNodeIds(state, node.id);
      return state;
    }
    case PC_LAYER_DOUBLE_CLICK: {
      const { node } = action as TreeLayerClick;
      state = setRootStateSyntheticNodeLabelEditing(node.id, true, state);
      return state;
    }
    case PC_LAYER_EDIT_LABEL_BLUR: {
      const { node } = action as TreeLayerClick;
      state = setRootStateSyntheticNodeLabelEditing(node.id, false, state);
      return state;
    }
    case PC_LAYER_LABEL_CHANGED: {
      const { label, node } = action as TreeLayerLabelChanged;
      state = setRootStateSyntheticNodeLabelEditing(node.id, false, state);
      state = persistRootStateBrowser(browser => persistChangeNodeLabel(label, getSyntheticSourceNode(node.id, browser).id, browser), state);
      return state;
    }
    case PC_LAYER_DROPPED_NODE: {
      const { node, targetNode, offset } = action as TreeLayerDroppedNode;
      const oldDocument = getSyntheticNodeDocument(targetNode.id, state.browser);
      const targetNodeWindow = getSyntheticNodeWindow(targetNode.id, state.browser);
      state = persistRootStateBrowser(browser => persistMoveSyntheticNode(node as SyntheticNode, targetNode.id, offset, browser), state);
      // if (!getSyntheticNodeById(node.id, state.browser)) {
      //   state = setSelectedSyntheticNodeIds(state, ...getInsertedDocumentElementIds(oldDocument, state.browser));
      // }

      state = setActiveFilePath(targetNodeWindow.location, state);

      // deselect until fixed -- exception thrown in various conditions
      // where synthetic node no longer exists.
      state = setSelectedSyntheticNodeIds(state);
      return state;
    }
    case PC_LAYER_MOUSE_OUT: {
      const { node } = action as TreeLayerMouseOut;
      state = setHoveringSyntheticNodeIds(state);
      return state;
    }
    case PC_LAYER_CLICK: {
      const { node, sourceEvent } = action as TreeLayerClick;

      if (sourceEvent.metaKey) {
        state = openSyntheticNodeOriginWindow(node.id, state);
      } else {
        const window = getSyntheticNodeWindow(node.id, state.browser);
        state = setActiveFilePath(window.location, state);
        state = setSelectedSyntheticNodeIds(state, node.id);
      }
      return state;
    }
    case PC_LAYER_EXPAND_TOGGLE_CLICK: {
      const { node } = action as TreeLayerExpandToggleClick;
      state = setRootStateSyntheticNodeExpanded(node.id, !getAttribute(node, "expanded", EDITOR_NAMESPACE), state);
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

      return openSyntheticWindow(entry.uri, state);
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
    case RESIZER_MOUSE_DOWN: {
      const { sourceEvent } = action as ResizerMouseDown;
      if (sourceEvent.metaKey) {
        state = openSyntheticNodeOriginWindow(state.selectedNodeIds[0], state);
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
      const metaKey = sourceEvent.metaKey;

      // do not allow selection while window is panning (scrolling)
      if (state.canvas.panning || state.canvas.movingOrResizing) return state;

      const targetNodeId = getCanvasMouseTargetNodeId(state, action as CanvasToolOverlayMouseMoved);

      if (!targetNodeId) {
        return state;
      }

      if (metaKey) {
        state = openSyntheticNodeOriginWindow(targetNodeId, state);
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
    case SLOT_TOGGLE_CLICK: {
      state = persistRootStateBrowser(browser => {
        return persistToggleSlotContainer(getSyntheticSourceNode(state.selectedNodeIds[0], state.browser).id, browser);
      }, state);
      return state;
    }
    case NATIVE_NODE_TYPE_CHANGED: {
      const {  nativeType } = action as NativeNodeTypeChanged;
      state = persistRootStateBrowser(browser => {
        return persistChangeNodeType(nativeType, getSyntheticSourceNode(state.selectedNodeIds[0], state.browser).id, browser)
      }, state);
      return state;
    }
    case TEXT_VALUE_CHANGED: {
      const {  value } = action as TextValueChanged;
      state = persistRootStateBrowser(browser => {
        return persistTextValue(value, getSyntheticSourceNode(state.selectedNodeIds[0], state.browser).id, browser)
      }, state);
      return state;
    }
    case CANVAS_TOOL_ARTBOARD_TITLE_CLICKED: {
      const { documentId, sourceEvent } = action as CanvasToolArtboardTitleClicked;
      state = updateCanvas({ smooth: false }, state);
      return handleArtboardSelectionFromAction(state, getSyntheticDocumentById(documentId, state.browser).root.id, action as CanvasToolArtboardTitleClicked);
    }
    case CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED: {
      return setSelectedSyntheticNodeIds(state);
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
          state = setSelectedSyntheticNodeIds(state, newDocument.root.id);
          return state;
        }
        case CanvasToolType.RECTANGLE: {
          const targetDocumentId = getDocumentRootIdFromPoint(bounds, state);
          const oldWindow = getActiveWindow(state);
          const document = targetDocumentId && getSyntheticNodeDocument(targetDocumentId, state.browser);
          state = persistRootStateBrowser(browser => {
            return persistInsertRectangle({
              ...shiftBounds(bounds, flipPoint(document ? document.bounds : { left: 0, top: 0 })),
              ...getBoundsSize(bounds),
              background: DEFAULT_RECT_COLOR,
              position: "absolute"
            }, document ? getSyntheticSourceNode(document.root.id, browser).id : browser.graph[oldWindow.location].content.id, browser)
          }, state);
          state = setSelectedSyntheticNodeIds(state, ...getInsertedWindowElementIds(oldWindow, state.browser));
          return state;
        }
        case CanvasToolType.TEXT: {
          const targetDocumentId = getDocumentRootIdFromPoint(bounds, state);
          const oldWindow = getActiveWindow(state);
          const document = targetDocumentId && getSyntheticNodeDocument(targetDocumentId, state.browser);

          state = persistRootStateBrowser(browser => {
            return persistInsertText({
              ...shiftBounds(shiftBounds(resizeBounds(bounds, { width: 100, height: 100 }), flipPoint(document ? document.bounds : { left: 0, top: 0 })), INSERT_TEXT_OFFSET),
              display: "inline-block",
              position: "relative"
            }, "double click to edit", document ? getSyntheticSourceNode(document.root.id, browser).id : browser.graph[oldWindow.location].content.id, browser);
          }, state);
          state = setSelectedSyntheticNodeIds(state, ...getInsertedWindowElementIds(oldWindow, state.browser));
          return state;
        }
      }
    }
  }

  return state;
};

const setFileExpanded = (node: TreeNode, value: boolean, state: RootState) => {
  state = updateRootState({
    projectDirectory: updateNestedNode(node, state.projectDirectory, (node) => setNodeAttribute(node, "expanded", value))
  }, state)
  return state;
}

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

const isInputSelected = (state: RootState) => {
  // ick -- this needs to be moved into a saga
  return document.activeElement && /textarea|input|button/i.test(document.activeElement.tagName);
}

const shortcutReducer = (state: RootState, action: Action): RootState => {

  switch(action.type) {
    case SHORTCUT_A_KEY_DOWN: {
      return isInputSelected(state) ? state : setCanvasTool(CanvasToolType.ARTBOARD, state);
    }
    case SHORTCUT_R_KEY_DOWN: {
      return isInputSelected(state) ? state :  setCanvasTool(CanvasToolType.RECTANGLE, state);
    }
    case SHORTCUT_T_KEY_DOWN: {
      return  isInputSelected(state) ? state : setCanvasTool(CanvasToolType.TEXT, state);
    }
    case SHORTCUT_QUICK_SEARCH_KEY_DOWN: {
      return isInputSelected(state) ? state : updateRootState({
        showQuickSearch: !state.showQuickSearch
      }, state);
    }
    case SHORTCUT_UNDO_KEY_DOWN: {
      return isInputSelected(state) || !state.activeFilePath ? state : undo(state.activeFilePath, state);
    }
    case SHORTCUT_REDO_KEY_DOWN: {
      return isInputSelected(state) || !state.activeFilePath ? state : redo(state.activeFilePath, state);
    }
    case SHORTCUT_ESCAPE_KEY_DOWN: {
      if (isInputSelected(state)) {
        return state;
      }
      if (state.canvas.toolType) {
        return updateCanvas({
          toolType: null
        }, state);
      } else {
        state = setSelectedSyntheticNodeIds(state);
        state = setSelectedFileNodeIds(state);
        state = updateRootState({ insertFileInfo: null }, state);
        return state;
      }
    }
    case SHORTCUT_DELETE_KEY_DOWN: {
      if (isInputSelected(state)) {
        return state;
      }
      const selection = state.selectedNodeIds;
      return setSelectedSyntheticNodeIds(persistRootStateBrowser(browser => persistDeleteSyntheticItems(selection, state.browser), state));
    }
  }

  return state;
};

const clipboardReducer = (state: RootState, action: Action) => {
  switch(action.type) {
    case SYNTHETIC_NODES_PASTED: {
      const { clips } = action as SyntheticNodesPasted;

      let targetSourceNode: TreeNode;

      if (state.selectedNodeIds.length) {
        const nodeId = state.selectedNodeIds[0];
        targetSourceNode = getSyntheticSourceNode(nodeId, state.browser);
      } else {
        targetSourceNode = state.browser.graph[state.activeFilePath].content;
      }

      const oldWindow = getActiveWindow(state);

      state = persistRootStateBrowser(browser => persistPasteSyntheticNodes(state.activeFilePath, targetSourceNode.id, clips, browser), state);
      const elementIds = getInsertedWindowElementIds(oldWindow, state.browser);
      state = setSelectedSyntheticNodeIds(state, elementIds[elementIds.length - 1]);
      return state;
    }
  }

  return state;
};

const handleArtboardSelectionFromAction = <T extends { sourceEvent: React.MouseEvent<any> }>(state: RootState, nodeId: string, event: T) => {
  const { sourceEvent } = event;
  state = setRootStateSyntheticNodeExpanded(nodeId, true, state);
  return setSelectedSyntheticNodeIds(state, nodeId);
}

// const resizeFullScreenArtboard = (state: RootState, width: number, height: number) => {
//   const workspace = getSelectedWorkspace(state);
//   if (workspace.stage.fullScreen && workspace.stage.container) {

//     // TODO - do not all getBoundingClientRect here. Dimensions need to be
//     return updateArtboardSize(state, workspace.stage.fullScreen.documentId, width, height);
//   }
//   return state;
// }

