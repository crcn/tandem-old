import { Action } from "redux";
import * as path from "path";
import { xmlToPCNode } from "../utils/paperclip";
import {
  CanvasToolArtboardTitleClicked,
  NEW_FILE_ADDED,
  PC_LAYER_EDIT_LABEL_BLUR,
  CANVAS_TOOL_ARTBOARD_TITLE_CLICKED,
  PC_LAYER_DOUBLE_CLICK,
  CanvasToolOverlayMouseMoved,
  PROJECT_DIRECTORY_LOADED,
  ProjectDirectoryLoaded,
  FILE_NAVIGATOR_ITEM_CLICKED,
  FileNavigatorItemClicked,
  CANVAS_WHEEL,
  CANVAS_MOUSE_MOVED,
  CANVAS_MOUNTED,
  CANVAS_MOUSE_CLICKED,
  CanvasToolOverlayClicked,
  RESIZER_MOUSE_DOWN,
  ResizerMouseDown,
  ResizerMoved,
  RESIZER_MOVED,
  RESIZER_PATH_MOUSE_STOPPED_MOVING,
  RESIZER_STOPPED_MOVING,
  ResizerPathStoppedMoving,
  RESIZER_PATH_MOUSE_MOVED,
  ResizerPathMoved,
  SHORTCUT_ESCAPE_KEY_DOWN,
  INSERT_TOOL_FINISHED,
  InsertToolFinished,
  SHORTCUT_DELETE_KEY_DOWN,
  CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED,
  SYNTHETIC_NODES_PASTED,
  SyntheticVisibleNodesPasted,
  FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED,
  OPEN_FILE_ITEM_CLICKED,
  OPEN_FILE_ITEM_CLOSE_CLICKED,
  OpenFilesItemClick,
  SAVED_FILE,
  SavedFile,
  SAVED_ALL_FILES,
  RAW_CSS_TEXT_CHANGED,
  RawCSSTextChanged,
  PC_LAYER_MOUSE_OVER,
  PC_LAYER_MOUSE_OUT,
  PC_LAYER_CLICK,
  PC_LAYER_EXPAND_TOGGLE_CLICK,
  TreeLayerLabelChanged,
  TreeLayerClick,
  TreeLayerDroppedNode,
  TreeLayerExpandToggleClick,
  FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED,
  TreeLayerMouseOver,
  PC_LAYER_DROPPED_NODE,
  FILE_NAVIGATOR_NEW_FILE_CLICKED,
  FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED,
  NewFileAdded,
  FILE_NAVIGATOR_DROPPED_ITEM,
  FileNavigatorDroppedItem,
  SHORTCUT_UNDO_KEY_DOWN,
  SHORTCUT_REDO_KEY_DOWN,
  PC_LAYER_LABEL_CHANGED,
  NATIVE_NODE_TYPE_CHANGED,
  TEXT_VALUE_CHANGED,
  TextValueChanged,
  ElementTypeChanged,
  NativeNodeTypeChanged,
  SHORTCUT_QUICK_SEARCH_KEY_DOWN,
  QUICK_SEARCH_ITEM_CLICKED,
  QuickSearchItemClicked,
  QUICK_SEARCH_BACKGROUND_CLICK,
  COMPONENT_VARIANT_NAME_CLICKED,
  ComponentVariantNameClicked,
  EDITOR_TAB_CLICKED,
  EditorTabClicked,
  CanvasWheel,
  SHORTCUT_ZOOM_IN_KEY_DOWN,
  SHORTCUT_ZOOM_OUT_KEY_DOWN,
  CanvasMounted,
  CANVAS_DROPPED_ITEM,
  CanvasDroppedItem,
  CANVAS_DRAGGED_OVER,
  SHORTCUT_CONVERT_TO_COMPONENT_KEY_DOWN,
  SHORTCUT_T_KEY_DOWN,
  SHORTCUT_R_KEY_DOWN,
  CanvasDraggingOver,
  ELEMENT_TYPE_CHANGED,
  CSS_PROPERTY_CHANGED,
  CSS_PROPERTY_CHANGE_COMPLETED,
  ATTRIBUTE_CHANGED,
  CSSPropertyChanged,
  FRAME_MODE_CHANGE_COMPLETE,
  FrameModeChangeComplete,
  TOOLBAR_TOOL_CLICKED,
  ToolbarToolClicked,
  EDITOR_TAB_CLOSE_BUTTON_CLICKED,
  SHORTCUT_SELECT_NEXT_TAB,
  SHORTCUT_SELECT_PREVIOUS_TAB,
  SHORTCUT_CLOSE_CURRENT_TAB,
  COMPONENT_PICKER_BACKGROUND_CLICK,
  ComponentPickerItemClick,
  COMPONENT_PICKER_ITEM_CLICK,
  SHORTCUT_C_KEY_DOWN,
  ADD_VARIANT_BUTTON_CLICKED,
  VARIANT_DEFAULT_SWITCH_CLICKED,
  VariantDefaultSwitchClicked,
  VariantLabelChanged,
  VARIANT_LABEL_CHANGED,
  VARIANT_CLICKED,
  VariantClicked,
  REMOVE_VARIANT_BUTTON_CLICKED,
  COMPONENT_INSTANCE_VARIANT_TOGGLED,
  INSTANCE_VARIANT_RESET_CLICKED,
  SHORTCUT_TOGGLE_SIDEBAR,
  INHERIT_PANE_ADD_BUTTON_CLICK,
  INHERIT_PANE_REMOVE_BUTTON_CLICK,
  InheritPaneItemClick,
  INHERIT_PANE_ITEM_CLICK,
  INHERIT_ITEM_COMPONENT_TYPE_CHANGE_COMPLETE,
  InheritItemComponentTypeChangeComplete,
  INHERIT_ITEM_CLICK,
  InheritItemClick,
  CANVAS_MOUSE_DOUBLE_CLICKED,
  CanvasMouseMoved,
  COMPONENT_CONTROLLER_ITEM_CLICKED,
  ComponentControllerItemClicked,
  COMPONENT_CONTROLLER_PICKED,
  ComponentControllerPicked,
  REMOVE_COMPONENT_CONTROLLER_BUTTON_CLICKED,
  SOURCE_INSPECTOR_LAYER_CLICKED,
  InspectorLayerEvent,
  SOURCE_INSPECTOR_LAYER_ARROW_CLICKED,
  SOURCE_INSPECTOR_LAYER_LABEL_CHANGED,
  InspectorLayerLabelChanged,
  SOURCE_INSPECTOR_LAYER_DROPPED,
  SourceInspectorLayerDropped,
  PropertyBindingUpdated,
  PROPERTY_BINDING_UPDATED,
  PROPERTY_BINDING_ADD_BUTTON_CLICKED,
  PROPERTY_BINDING_REMOVE_BUTTON_CLICKED,
  PropertyBindingRemoveButtonClicked
} from "../actions";
import {
  queueOpenFile,
  fsSandboxReducer,
  isImageUri,
  hasFileCacheItem,
  FS_SANDBOX_ITEM_LOADED,
  FSSandboxItemLoaded,
  isSvgUri
} from "fsbox";
import {
  RootState,
  updateRootState,
  updateOpenFileCanvas,
  getCanvasMouseTargetNodeId,
  setSelectedSyntheticVisibleNodeIds,
  getSelectionBounds,
  getBoundedSelection,
  ToolType,
  setTool,
  persistRootState,
  getOpenFile,
  openFile,
  removeTemporaryOpenFiles,
  setNextOpenFile,
  updateOpenFile,
  deselectRootProjectFiles,
  setHoveringSyntheticVisibleNodeIds,
  setRootStateSyntheticVisibleNodeExpanded,
  setSelectedFileNodeIds,
  InsertFileType,
  setInsertFile,
  undo,
  redo,
  setRootStateSyntheticVisibleNodeLabelEditing,
  getEditorWithActiveFileUri,
  getActiveEditorWindow,
  getEditorWindowWithFileUri,
  updateEditorWindow,
  centerEditorCanvas,
  getCanvasMouseTargetNodeIdFromPoint,
  isSelectionMovable,
  SyntheticVisibleNodeMetadataKeys,
  selectInsertedSyntheticVisibleNodes,
  RegisteredComponent,
  closeFile,
  queueSelectInsertedSyntheticVisibleNodes,
  shiftActiveEditorTab,
  confirm,
  ConfirmType,
  openSyntheticVisibleNodeOriginFile,
  updateSourceInspectorNode
} from "../state";
import {
  PCSourceTagNames,
  PCVisibleNode,
  PCTextNode,
  paperclipReducer,
  SyntheticElement,
  createPCElement,
  createPCTextNode,
  getSyntheticVisibleNodeRelativeBounds,
  getSyntheticVisibleNodeDocument,
  getSyntheticSourceNode,
  getSyntheticNodeById,
  SyntheticVisibleNode,
  getPCNodeDependency,
  updateSyntheticVisibleNodePosition,
  updateSyntheticVisibleNodeBounds,
  persistInsertNode,
  persistChangeLabel,
  persistSyntheticVisibleNodeBounds,
  persistRemoveSyntheticVisibleNode,
  getSyntheticNodeSourceDependency,
  persistConvertNodeToComponent,
  persistMoveSyntheticVisibleNode,
  persistAppendPCClips,
  persistChangeSyntheticTextNodeValue,
  persistRawCSSText,
  SyntheticTextNode,
  updatePCNodeMetadata,
  PCVisibleNodeMetadataKey,
  getSyntheticDocumentByDependencyUri,
  getFrameSyntheticNode,
  SyntheticDocument,
  PC_DEPENDENCY_GRAPH_LOADED,
  PCDependencyGraphLoaded,
  SYNTHETIC_DOCUMENT_NODE_NAME,
  DEFAULT_FRAME_BOUNDS,
  isSyntheticVisibleNode,
  persistChangeElementType,
  persistAddComponentController,
  persistRemoveComponentController,
  PC_RUNTIME_EVALUATED,
  persistCSSProperty,
  persistAttribute,
  getPCNode,
  persistSyntheticNodeMetadata,
  createPCComponentInstance,
  getSyntheticVisibleNodeFrame,
  persistAddVariant,
  persistUpdateVariant,
  persistRemoveVariant,
  SyntheticInstanceElement,
  persistToggleVariantDefault,
  persistRemoveVariantOverride,
  getPCVariants,
  canRemoveSyntheticVisibleNode,
  persistInheritStyle,
  persistInheritStyleComponentId,
  isPaperclipUri,
  syntheticNodeIsInShadow,
  persistUpdatePropertyBinding,
  persistAddPropertyBinding,
  persistRemovePropertyBinding,
  getSyntheticContentNode,
  PCOverridablePropertyName,
  getSyntheticInstancePath,
  PCComponentInstanceElement
} from "paperclip";
import {
  roundBounds,
  scaleInnerBounds,
  moveBounds,
  keepBoundsAspectRatio,
  keepBoundsCenter,
  Bounds,
  shiftBounds,
  isDirectory,
  updateNestedNode,
  Directory,
  isFile,
  getParentTreeNode,
  appendChildNode,
  removeNestedTreeNode,
  boundsFromRect,
  centerTransformZoom,
  Translate,
  zoomBounds,
  TreeMoveOffset,
  shiftPoint,
  Point,
  zoomPoint,
  cloneTreeNode,
  FSItemTagNames,
  FSItem,
  getFileFromUri,
  createFile,
  createDirectory,
  sortFSItems,
  EMPTY_OBJECT,
  getNestedTreeNodeById,
  EMPTY_ARRAY
} from "tandem-common";
import { clamp, last } from "lodash";
import {
  expandInspectorNode,
  collapseInspectorNode,
  expandSyntheticInspectorNode,
  getInspectorSyntheticNode,
  isInspectorNode
} from "../state/pc-inspector-tree";

const ZOOM_SENSITIVITY = process.platform === "win32" ? 2500 : 250;
const MIN_ZOOM = 0.02;
const MAX_ZOOM = 6400 / 100;

export const rootReducer = (state: RootState, action: Action): RootState => {
  state = fsSandboxReducer(state, action);
  state = paperclipReducer(state, action);
  state = canvasReducer(state, action);
  state = shortcutReducer(state, action);
  state = clipboardReducer(state, action);

  switch (action.type) {
    case PROJECT_DIRECTORY_LOADED: {
      const { directory } = action as ProjectDirectoryLoaded;
      return updateRootState(
        { projectDirectory: directory, ready: true },
        state
      );
    }
    case FILE_NAVIGATOR_ITEM_CLICKED: {
      const { node } = action as FileNavigatorItemClicked;
      const uri = node.uri;
      state = setSelectedFileNodeIds(state, node.id);
      state = setFileExpanded(node, true, state);

      if (!isDirectory(node)) {
        state = openFile(uri, true, false, state);
        return state;
      }

      return state;
    }
    case QUICK_SEARCH_ITEM_CLICKED: {
      const { file } = action as QuickSearchItemClicked;
      const uri = file.uri;
      state = openFile(uri, false, false, state);
      state = updateRootState({ showQuickSearch: false }, state);
      return state;
    }
    case QUICK_SEARCH_BACKGROUND_CLICK: {
      return (state = updateRootState({ showQuickSearch: false }, state));
    }
    case FILE_NAVIGATOR_TOGGLE_DIRECTORY_CLICKED: {
      const { node } = action as FileNavigatorItemClicked;
      state = setFileExpanded(node, !node.expanded, state);
      return state;
    }
    case FILE_NAVIGATOR_ITEM_DOUBLE_CLICKED: {
      const { node } = action as FileNavigatorItemClicked;
      const uri = node.uri;
      const file = getFileFromUri(uri, state.projectDirectory);
      if (isFile(file)) {
        state = openFile(uri, false, false, state);
      }

      return state;
    }
    case FILE_NAVIGATOR_NEW_FILE_CLICKED: {
      return setInsertFile(InsertFileType.FILE, state);
    }
    case FILE_NAVIGATOR_NEW_DIRECTORY_CLICKED: {
      return setInsertFile(InsertFileType.DIRECTORY, state);
    }

    case CANVAS_MOUNTED: {
      const { fileUri, element } = action as CanvasMounted;
      if (!element) {
        return state;
      }

      const { width = 400, height = 300 } =
        element.getBoundingClientRect() || {};

      state = updateEditorWindow(
        {
          container: element
        },
        fileUri,
        state
      );

      const selectedNodeId = state.selectedNodeIds[0];
      if (selectedNodeId) {
        const document = getSyntheticDocumentByDependencyUri(
          fileUri,
          state.documents,
          state.graph
        );
        if (getNestedTreeNodeById(selectedNodeId, document)) {
          return centerEditorCanvas(state, fileUri, getSelectionBounds(state));
        }
      } else {
        return centerEditorCanvas(state, fileUri);
      }
    }

    case FILE_NAVIGATOR_DROPPED_ITEM: {
      const { node, targetNode } = action as FileNavigatorDroppedItem;
      const parent: Directory = getParentTreeNode(
        node.id,
        state.projectDirectory
      );
      const parentUri = parent.uri;
      const nodeUri = node.uri;
      state = updateRootState(
        {
          projectDirectory: updateNestedNode(
            parent,
            state.projectDirectory,
            parent => removeNestedTreeNode(node, parent)
          )
        },
        state
      );

      const targetDir: Directory =
        targetNode.name !== FSItemTagNames.FILE
          ? targetNode
          : getParentTreeNode(targetNode.id, state.projectDirectory);
      const targetUri = targetDir.uri;
      state = updateRootState(
        {
          projectDirectory: updateNestedNode(
            targetDir,
            state.projectDirectory,
            targetNode => {
              return appendChildNode(
                {
                  ...node,
                  uri: nodeUri.replace(parentUri, targetUri)
                } as FSItem,
                targetNode
              );
            }
          )
        },
        state
      );

      return state;
    }
    case NEW_FILE_ADDED: {
      const { uri, fileType } = action as NewFileAdded;
      const directory = getFileFromUri(
        path.dirname(uri),
        state.projectDirectory
      );

      state = updateRootState(
        {
          insertFileInfo: null,
          projectDirectory: updateNestedNode(
            directory,
            state.projectDirectory,
            dir => {
              return {
                ...dir,
                children: sortFSItems([
                  ...dir.children,
                  fileType === FSItemTagNames.FILE
                    ? createFile(uri)
                    : createDirectory(uri)
                ])
              };
            }
          )
        },
        state
      );

      if (fileType === FSItemTagNames.FILE && isPaperclipUri(uri)) {
        state = openFile(uri, false, false, state);
      }
      return state;
    }

    case FS_SANDBOX_ITEM_LOADED: {
      const { uri, content } = action as FSSandboxItemLoaded;

      if (state.queuedDndInfo) {
        const { item, point, editorUri } = state.queuedDndInfo;
        return handleLoadedDroppedItem(
          item,
          point,
          editorUri,
          { ...state, queuedDndInfo: null },
          content
        );
      }

      const editor = getEditorWindowWithFileUri(uri, state);

      return state;
    }
    case OPEN_FILE_ITEM_CLICKED: {
      const { uri, sourceEvent } = action as OpenFilesItemClick;
      if (getEditorWithActiveFileUri(uri, state)) {
        return state;
      }
      state = setNextOpenFile(
        removeTemporaryOpenFiles(openFile(uri, false, false, state))
      );
      return state;
    }
    case SAVED_FILE: {
      const { uri } = action as SavedFile;
      return updateOpenFile({ newContent: null }, uri, state);
    }
    case SAVED_ALL_FILES: {
      return updateRootState(
        {
          openFiles: state.openFiles.map(openFile => ({
            ...openFile,
            newContent: null
          }))
        },
        state
      );
    }
    case COMPONENT_VARIANT_NAME_CLICKED: {
      const { name } = action as ComponentVariantNameClicked;
      state = updateRootState({ selectedComponentVariantName: name }, state);
      return state;
    }
    case PC_LAYER_MOUSE_OVER: {
      const { node } = action as TreeLayerMouseOver;
      state = setHoveringSyntheticVisibleNodeIds(state, node.id);
      return state;
    }
    case PC_LAYER_DOUBLE_CLICK: {
      const { node } = action as TreeLayerClick;
      state = setRootStateSyntheticVisibleNodeLabelEditing(
        node.id,
        true,
        state
      );
      return state;
    }
    case PC_LAYER_EDIT_LABEL_BLUR: {
      const { node } = action as TreeLayerClick;
      state = setRootStateSyntheticVisibleNodeLabelEditing(
        node.id,
        false,
        state
      );
      return state;
    }
    case PC_LAYER_LABEL_CHANGED: {
      const { label, node } = action as TreeLayerLabelChanged;

      state = setRootStateSyntheticVisibleNodeLabelEditing(
        node.id,
        false,
        state
      );
      state = persistRootState(
        browser =>
          persistChangeLabel(label, node as SyntheticVisibleNode, browser),
        state
      );
      return state;
    }

    // DEPRECATED
    case PC_LAYER_DROPPED_NODE: {
      const { node, targetNode, offset } = action as TreeLayerDroppedNode;

      const oldState = state;

      state = persistRootState(
        state =>
          persistMoveSyntheticVisibleNode(
            node as SyntheticVisibleNode,
            targetNode as SyntheticVisibleNode,
            offset,
            state
          ),
        state
      );

      const document = getSyntheticVisibleNodeDocument(
        targetNode.id,
        state.documents
      );
      const mutatedTarget =
        offset === TreeMoveOffset.APPEND || offset === TreeMoveOffset.PREPEND
          ? targetNode
          : getParentTreeNode(targetNode.id, document);

      state = queueSelectInsertedSyntheticVisibleNodes(
        oldState,
        state,
        mutatedTarget
      );
      return state;
    }
    case SOURCE_INSPECTOR_LAYER_DROPPED: {
      const { source, target, offset } = action as SourceInspectorLayerDropped;

      const sourceSyntheticNode = getInspectorSyntheticNode(
        source,
        state.documents,
        state.graph
      );
      const targetSyntheticNode = getInspectorSyntheticNode(
        target,
        state.documents,
        state.graph
      );

      const oldState = state;

      state = persistRootState(
        state =>
          persistMoveSyntheticVisibleNode(
            sourceSyntheticNode,
            targetSyntheticNode,
            offset,
            state
          ),
        state
      );

      const document = getSyntheticVisibleNodeDocument(
        targetSyntheticNode.id,
        state.documents
      );
      const mutatedTarget =
        offset === TreeMoveOffset.APPEND || offset === TreeMoveOffset.PREPEND
          ? targetSyntheticNode
          : getParentTreeNode(targetSyntheticNode.id, document);

      state = queueSelectInsertedSyntheticVisibleNodes(
        oldState,
        state,
        mutatedTarget
      );
      return state;
    }
    case PC_LAYER_MOUSE_OUT: {
      state = setHoveringSyntheticVisibleNodeIds(state);
      return state;
    }
    case PC_LAYER_CLICK: {
      const { node, sourceEvent } = action as TreeLayerClick;
      if (sourceEvent.altKey) {
        // state = openSyntheticVisibleNodeOriginFile(node.id, state);
      } else {
        const doc = getSyntheticVisibleNodeDocument(node.id, state.documents);
        const dep = getSyntheticNodeSourceDependency(doc, state.graph);
        state = openFile(dep.uri, false, false, state);
        state = setSelectedSyntheticVisibleNodeIds(
          state,
          ...(sourceEvent.shiftKey
            ? [...state.selectedNodeIds, node.id]
            : [node.id])
        );
      }
      return state;
    }
    case PC_LAYER_EXPAND_TOGGLE_CLICK: {
      const { node } = action as TreeLayerExpandToggleClick;
      state = setRootStateSyntheticVisibleNodeExpanded(
        node.id,
        !(node as SyntheticVisibleNode).metadata[
          SyntheticVisibleNodeMetadataKeys.EXPANDED
        ],
        state
      );
      return state;
    }
    case SOURCE_INSPECTOR_LAYER_CLICKED: {
      const { node } = action as InspectorLayerEvent;
      state = updateSourceInspectorNode(state, sourceNodeInspector => {
        return expandInspectorNode(node, sourceNodeInspector, state.graph);
      });

      const assocSyntheticNode = getInspectorSyntheticNode(
        node,
        state.documents,
        state.graph
      );

      state = updateRootState(
        {
          selectedInspectorNodeIds: [node.id],
          selectedNodeIds: assocSyntheticNode ? [assocSyntheticNode.id] : []
        },
        state
      );

      return state;
    }
    case SOURCE_INSPECTOR_LAYER_ARROW_CLICKED: {
      const { node } = action as InspectorLayerEvent;
      state = updateSourceInspectorNode(state, sourceNodeInspector => {
        return node.expanded
          ? collapseInspectorNode(node, sourceNodeInspector)
          : expandInspectorNode(node, sourceNodeInspector, state.graph);
      });

      return state;
    }
    case SOURCE_INSPECTOR_LAYER_LABEL_CHANGED: {
      const { node, label } = action as InspectorLayerLabelChanged;

      state = persistRootState(
        browser =>
          persistChangeLabel(
            label,
            getInspectorSyntheticNode(node, browser.documents, browser.graph),
            browser
          ),
        state
      );

      return state;
    }
    case COMPONENT_CONTROLLER_ITEM_CLICKED: {
      const { relativePath } = action as ComponentControllerItemClicked;
      return updateRootState(
        {
          selectedControllerRelativePath:
            relativePath === state.selectedControllerRelativePath
              ? null
              : relativePath
        },
        state
      );
    }
    case OPEN_FILE_ITEM_CLOSE_CLICKED: {
      // TODO - flag confirm remove state
      const { uri } = action as OpenFilesItemClick;
      return closeFile(uri, state);
    }
    case EDITOR_TAB_CLICKED: {
      const { uri } = action as EditorTabClicked;
      return openFile(uri, false, false, state);
    }
    case EDITOR_TAB_CLOSE_BUTTON_CLICKED: {
      const { uri } = action as EditorTabClicked;
      return closeFile(uri, state);
    }
    case PC_DEPENDENCY_GRAPH_LOADED: {
      state = centerEditorCanvas(state, state.activeEditorFilePath);
      return state;
    }
  }
  return state;
};

export const canvasReducer = (state: RootState, action: Action) => {
  switch (action.type) {
    case RESIZER_MOVED: {
      const { point: newPoint } = action as ResizerMoved;
      state = updateEditorWindow(
        {
          movingOrResizing: true
        },
        state.activeEditorFilePath,
        state
      );

      if (isSelectionMovable(state)) {
        const selectionBounds = getSelectionBounds(state);
        const nodeId = state.selectedNodeIds[0];

        let movedBounds = moveBounds(selectionBounds, newPoint);

        for (const nodeId of state.selectedNodeIds) {
          const itemBounds = getSyntheticVisibleNodeRelativeBounds(
            getSyntheticNodeById(nodeId, state.documents),
            state.frames
          );
          const newBounds = roundBounds(
            scaleInnerBounds(itemBounds, selectionBounds, movedBounds)
          );

          state = updateSyntheticVisibleNodePosition(
            newBounds,
            getSyntheticNodeById(nodeId, state.documents),
            state
          );
        }
      }

      return state;
    }
    case RESIZER_MOUSE_DOWN: {
      const { sourceEvent } = action as ResizerMouseDown;
      if (sourceEvent.metaKey) {
        // state = openSyntheticVisibleNodeOriginFile(state.selectedNodeIds[0], state);
      }
      return state;
    }

    case COMPONENT_PICKER_BACKGROUND_CLICK: {
      return setTool(null, state);
    }

    case COMPONENT_PICKER_ITEM_CLICK: {
      const { component } = action as ComponentPickerItemClick;
      return {
        ...state,
        selectedComponentId: component.id
      };
    }

    case TOOLBAR_TOOL_CLICKED: {
      const { toolType } = action as ToolbarToolClicked;
      if (toolType === ToolType.POINTER) {
        state = setTool(null, state);
      } else {
        state = setTool(toolType, state);
      }
      return state;
    }

    case ADD_VARIANT_BUTTON_CLICKED: {
      const node = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      );
      const frame = getSyntheticVisibleNodeFrame(node, state.frames);
      const contentNode = getSyntheticNodeById(
        frame.contentNodeId,
        state.documents
      );
      state = persistRootState(
        state => persistAddVariant(contentNode, state),
        state
      );
      state = updateRootState(
        {
          selectedVariant: last(
            getPCVariants(getSyntheticSourceNode(contentNode, state.graph))
          )
        },
        state
      );
      return state;
    }

    case REMOVE_VARIANT_BUTTON_CLICKED: {
      const variant = state.selectedVariant;
      state = persistRootState(
        state => persistRemoveVariant(variant, state),
        state
      );
      state = updateRootState({ selectedVariant: null }, state);
      return state;
    }

    case VARIANT_DEFAULT_SWITCH_CLICKED: {
      const { variant } = action as VariantDefaultSwitchClicked;
      state = persistRootState(
        state =>
          persistUpdateVariant(
            { isDefault: !variant.isDefault },
            variant,
            state
          ),
        state
      );
      return state;
    }

    case VARIANT_LABEL_CHANGED: {
      const { variant, newLabel } = action as VariantLabelChanged;
      state = persistRootState(
        state => persistUpdateVariant({ label: newLabel }, variant, state),
        state
      );
      return state;
    }

    case VARIANT_CLICKED: {
      const { variant } = action as VariantClicked;

      // must be enabled in order to see CSS changes
      const selectedVariant =
        state.selectedVariant && state.selectedVariant.id === variant.id
          ? null
          : variant;
      if (selectedVariant) {
        state = persistRootState(
          state => persistUpdateVariant({ isDefault: true }, variant, state),
          state
        );
      }
      state = updateRootState({ selectedVariant }, state);
      return state;
    }

    case COMPONENT_INSTANCE_VARIANT_TOGGLED: {
      const { variant } = action as VariantClicked;
      const element = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      ) as SyntheticInstanceElement;
      state = persistRootState(
        state =>
          persistToggleVariantDefault(
            element,
            variant.id,
            state.selectedVariant,
            state
          ),
        state
      );
      return state;
    }

    case INSTANCE_VARIANT_RESET_CLICKED: {
      const { variant } = action as VariantClicked;
      const element = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      ) as SyntheticInstanceElement;
      state = persistRootState(
        state =>
          persistRemoveVariantOverride(
            element,
            variant.id,
            state.selectedVariant,
            state
          ),
        state
      );
      return state;
    }

    case RESIZER_STOPPED_MOVING: {
      const { point } = action as ResizerMoved;
      const oldGraph = state.graph;

      if (isSelectionMovable(state)) {
        state = persistRootState(state => {
          return state.selectedNodeIds.reduce((state, nodeId) => {
            return persistSyntheticVisibleNodeBounds(
              getSyntheticNodeById(nodeId, state.documents),
              state
            );
          }, state);
        }, state);
      }

      state = updateEditorWindow(
        {
          movingOrResizing: false
        },
        state.activeEditorFilePath,
        state
      );
      return state;
    }

    case CANVAS_WHEEL: {
      const {
        metaKey,
        ctrlKey,
        deltaX,
        deltaY,
        canvasHeight,
        canvasWidth
      } = action as CanvasWheel;
      const editorWindow = getActiveEditorWindow(state);
      const openFile = getOpenFile(editorWindow.activeFilePath, state);

      let translate = openFile.canvas.translate;

      if (metaKey || ctrlKey) {
        translate = centerTransformZoom(
          translate,
          boundsFromRect({
            width: canvasWidth,
            height: canvasHeight
          }),
          clamp(
            translate.zoom + (translate.zoom * deltaY) / ZOOM_SENSITIVITY,
            MIN_ZOOM,
            MAX_ZOOM
          ),
          editorWindow.mousePosition
        );
      } else {
        translate = {
          ...translate,
          left: translate.left - deltaX,
          top: translate.top - deltaY
        };
      }

      state = updateEditorWindow(
        { smooth: false },
        editorWindow.activeFilePath,
        state
      );

      state = updateOpenFileCanvas(
        {
          translate
        },
        editorWindow.activeFilePath,
        state
      );

      return state;
    }

    case CANVAS_DROPPED_ITEM: {
      let { item, point, editorUri } = action as CanvasDroppedItem;

      if (isFile(item)) {
        return queueOpenFile(item.uri, {
          ...(state as any),
          queuedDndInfo: action
        });
      } else {
        return handleLoadedDroppedItem(item, point, editorUri, state);
      }
    }

    case SHORTCUT_ZOOM_IN_KEY_DOWN: {
      const editor = getActiveEditorWindow(state);
      const openFile = getOpenFile(editor.activeFilePath, state);
      state = setCanvasZoom(
        normalizeZoom(openFile.canvas.translate.zoom) * 2,
        false,
        editor.activeFilePath,
        state
      );
      return state;
    }

    case SHORTCUT_TOGGLE_SIDEBAR: {
      state = {
        ...state,
        showSidebar: state.showSidebar !== false ? false : true
      };

      return state;
    }

    case SHORTCUT_ZOOM_OUT_KEY_DOWN: {
      const editor = getActiveEditorWindow(state);
      const openFile = getOpenFile(editor.activeFilePath, state);
      state = setCanvasZoom(
        normalizeZoom(openFile.canvas.translate.zoom) / 2,
        false,
        editor.activeFilePath,
        state
      );
      return state;
    }

    case SHORTCUT_SELECT_NEXT_TAB: {
      return shiftActiveEditorTab(1, state);
    }
    case SHORTCUT_SELECT_PREVIOUS_TAB: {
      return shiftActiveEditorTab(-1, state);
    }
    case SHORTCUT_CLOSE_CURRENT_TAB: {
      return closeFile(state.activeEditorFilePath, state);
    }

    case CANVAS_MOUSE_MOVED: {
      const {
        editorWindow: { activeFilePath },
        sourceEvent: { pageX, pageY }
      } = action as CanvasMouseMoved;
      state = updateEditorWindow(
        { mousePosition: { left: pageX, top: pageY } },
        state.activeEditorFilePath,
        state
      );

      let targetNodeId: string;
      state = updateRootState({ activeEditorFilePath: activeFilePath }, state);
      const editorWindow = getEditorWindowWithFileUri(activeFilePath, state);

      if (!editorWindow.movingOrResizing) {
        targetNodeId = getCanvasMouseTargetNodeId(
          state,
          action as CanvasToolOverlayMouseMoved,
          state.toolType != null ? getInsertFilter(state) : () => true
        );
      }

      state = updateRootState(
        {
          hoveringNodeIds: targetNodeId ? [targetNodeId] : []
        },
        state
      );

      return state;
    }

    case CANVAS_DRAGGED_OVER: {
      const { item, offset } = action as CanvasDraggingOver;

      state = updateEditorWindow(
        { mousePosition: offset },
        state.activeEditorFilePath,
        state
      );

      // remove selection so that hovering state is visible
      state = setSelectedSyntheticVisibleNodeIds(state);

      // TODO - in the future, we'll probably want to be able to highlight hovered nodes as the user is moving an element around to indicate where
      // they can drop the element.

      let targetNodeId: string;
      const editor = getActiveEditorWindow(state);

      targetNodeId = getCanvasMouseTargetNodeIdFromPoint(
        state,
        offset,
        getDragFilter(item, state)
      );

      state = updateRootState(
        {
          hoveringNodeIds: targetNodeId ? [targetNodeId] : []
        },
        state
      );

      return state;
    }

    case CANVAS_MOUSE_CLICKED: {
      if (state.toolType != null) {
        return state;
      }

      state = deselectRootProjectFiles(state);

      const { sourceEvent } = action as CanvasToolOverlayClicked;
      if (/textarea|input/i.test((sourceEvent.target as Element).nodeName)) {
        return state;
      }

      // alt key opens up a new link
      const altKey = sourceEvent.altKey;

      const editorWindow = getActiveEditorWindow(state);
      const openFile = getOpenFile(editorWindow.activeFilePath, state);

      // do not allow selection while window is panning (scrolling)
      if (openFile.canvas.panning || editorWindow.movingOrResizing)
        return state;

      const targetNodeId = getCanvasMouseTargetNodeId(
        state,
        action as CanvasToolOverlayMouseMoved
      );

      if (!targetNodeId) {
        return setSelectedSyntheticVisibleNodeIds(state);
      }

      if (!altKey) {
        state = handleArtboardSelectionFromAction(
          state,
          targetNodeId,
          action as CanvasToolOverlayMouseMoved
        );
        state = updateEditorWindow(
          {
            secondarySelection: false
          },
          editorWindow.activeFilePath,
          state
        );

        return state;
      }
      return state;
    }
    case CANVAS_MOUSE_DOUBLE_CLICKED: {
      const targetNodeId = getCanvasMouseTargetNodeId(
        state,
        action as CanvasToolOverlayMouseMoved
      );

      if (!targetNodeId) {
        return state;
      }

      state = openSyntheticVisibleNodeOriginFile(
        getSyntheticNodeById(targetNodeId, state.documents),
        state
      );
      return state;
    }

    case RESIZER_PATH_MOUSE_MOVED: {
      state = updateEditorWindow(
        {
          movingOrResizing: true
        },
        state.activeEditorFilePath,
        state
      );

      // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
      const newBounds = getResizeActionBounds(action as ResizerPathMoved);
      for (const nodeId of getBoundedSelection(state)) {
        state = updateSyntheticVisibleNodeBounds(
          getNewSyntheticVisibleNodeBounds(
            newBounds,
            getSyntheticNodeById(nodeId, state.documents),
            state
          ),
          getSyntheticNodeById(nodeId, state.documents),
          state
        );
      }

      return state;
    }
    case RESIZER_PATH_MOUSE_STOPPED_MOVING: {
      state = updateEditorWindow(
        {
          movingOrResizing: false
        },
        state.activeEditorFilePath,
        state
      );

      // TODO - possibly use BoundsStruct instead of Bounds since there are cases where bounds prop doesn't exist
      const newBounds = getResizeActionBounds(
        action as ResizerPathStoppedMoving
      );

      state = persistRootState(state => {
        return state.selectedNodeIds.reduce(
          (state, nodeId) =>
            persistSyntheticVisibleNodeBounds(
              getSyntheticNodeById(nodeId, state.documents),
              state
            ),
          state
        );
      }, state);

      return state;
    }
    case RAW_CSS_TEXT_CHANGED: {
      const { value: cssText } = action as RawCSSTextChanged;
      state = persistRootState(browser => {
        return state.selectedNodeIds.reduce(
          (state, nodeId) =>
            persistRawCSSText(
              cssText,
              getSyntheticNodeById(nodeId, state.documents),
              state.selectedVariant,
              state
            ),
          state
        );
      }, state);
      return state;
    }

    case FRAME_MODE_CHANGE_COMPLETE: {
      const { frame, mode } = action as FrameModeChangeComplete;
      state = persistRootState(state => {
        return persistSyntheticNodeMetadata(
          { mode },
          getSyntheticNodeById(frame.contentNodeId, state.documents),
          state
        );
      }, state);
      return state;
    }
    case CSS_PROPERTY_CHANGED: {
      const { name, value } = action as CSSPropertyChanged;
      return state.selectedNodeIds.reduce(
        (state, nodeId) =>
          persistCSSProperty(
            name,
            value,
            getSyntheticNodeById(nodeId, state.documents),
            state.selectedVariant,
            state
          ),
        state
      );
    }

    case CSS_PROPERTY_CHANGE_COMPLETED: {
      const { name, value } = action as CSSPropertyChanged;
      state = persistRootState(browser => {
        return state.selectedNodeIds.reduce(
          (state, nodeId) =>
            persistCSSProperty(
              name,
              value,
              getSyntheticNodeById(nodeId, state.documents),
              state.selectedVariant,
              state
            ),
          state
        );
      }, state);
      return state;
    }

    case ATTRIBUTE_CHANGED: {
      const { name, value } = action as CSSPropertyChanged;
      state = persistRootState(browser => {
        return state.selectedNodeIds.reduce(
          (state, nodeId) =>
            persistAttribute(
              name,
              value,
              getSyntheticNodeById(nodeId, state.documents) as SyntheticElement,
              state
            ),
          state
        );
      }, state);
      return state;
    }

    case INHERIT_PANE_REMOVE_BUTTON_CLICK: {
      const { selectedInheritComponentId, selectedNodeIds } = state;
      const node = getSyntheticNodeById(selectedNodeIds[0], state.documents);
      state = persistRootState(state => {
        return persistInheritStyle(
          { [selectedInheritComponentId]: undefined },
          node,
          state.selectedVariant,
          state
        );
      }, state);
      state = updateRootState({ selectedInheritComponentId: null }, state);
      return state;
    }

    case INHERIT_PANE_ADD_BUTTON_CLICK: {
      const { selectedNodeIds } = state;
      const node = getSyntheticNodeById(selectedNodeIds[0], state.documents);
      const sourceNode = getSyntheticSourceNode(node, state.graph);

      state = persistRootState(state => {
        // undefined so that nothing is selected in dropdown.
        state = persistInheritStyle(
          {
            [Date.now()]: {
              priority: Object.keys(sourceNode.inheritStyle || EMPTY_OBJECT)
                .length
            }
          },
          node,
          state.selectedVariant,
          state
        );
        return state;
      }, state);

      return state;
    }

    case INHERIT_PANE_ITEM_CLICK: {
      const { componentId } = action as InheritPaneItemClick;
      state = updateRootState(
        {
          selectedInheritComponentId:
            state.selectedInheritComponentId === componentId
              ? null
              : componentId
        },
        state
      );
      return state;
    }

    case INHERIT_ITEM_COMPONENT_TYPE_CHANGE_COMPLETE: {
      const {
        oldComponentId,
        newComponentId
      } = action as InheritItemComponentTypeChangeComplete;
      const { selectedNodeIds } = state;
      const node = getSyntheticNodeById(selectedNodeIds[0], state.documents);
      state = persistRootState(state => {
        state = persistInheritStyleComponentId(
          oldComponentId,
          newComponentId,
          node,
          state.selectedVariant,
          state
        );
        return state;
      }, state);
      return state;
    }

    case INHERIT_ITEM_CLICK: {
      const { componentId } = action as InheritItemClick;
      state = updateRootState(
        {
          selectedInheritComponentId:
            state.selectedInheritComponentId === componentId
              ? null
              : componentId
        },
        state
      );
      return state;
    }

    case PC_RUNTIME_EVALUATED: {
      const queuedScopeSelect = state.queuedScopeSelect;

      if (queuedScopeSelect) {
        state = selectInsertedSyntheticVisibleNodes(
          queuedScopeSelect.previousState,
          state,
          queuedScopeSelect.scope
        );
      }

      // ensure that synthetic nodes still exist, otherwise remove them
      // from selection.
      for (const nodeId of state.selectedNodeIds) {
        if (!getSyntheticNodeById(nodeId, state.documents)) {
          state = setSelectedSyntheticVisibleNodeIds(state);
          break;
        }
      }

      return updateRootState({ queuedScopeSelect: null }, state);
    }

    case NATIVE_NODE_TYPE_CHANGED: {
      const { nativeType } = action as NativeNodeTypeChanged;
      // state = persistRootState(browser => {
      //   return persistChangeNodeType(
      //     nativeType,
      //     getSyntheticSourceNode(
      //       state.selectedNodeIds[0],
      //       state.paperclip
      //     ) as PCElement,
      //     browser
      //   );
      // }, state);
      return state;
    }
    case TEXT_VALUE_CHANGED: {
      const { value } = action as TextValueChanged;
      state = persistRootState(state => {
        return persistChangeSyntheticTextNodeValue(
          value,
          getSyntheticNodeById(
            state.selectedNodeIds[0],
            state.documents
          ) as SyntheticTextNode,
          state
        );
      }, state);
      return state;
    }
    case ELEMENT_TYPE_CHANGED: {
      const { value } = action as ElementTypeChanged;
      state = persistRootState(state => {
        return persistChangeElementType(
          value,
          getSyntheticNodeById(
            state.selectedNodeIds[0],
            state.documents
          ) as SyntheticElement,
          state
        );
      }, state);
      return state;
    }
    case CANVAS_TOOL_ARTBOARD_TITLE_CLICKED: {
      const { frame, sourceEvent } = action as CanvasToolArtboardTitleClicked;
      sourceEvent.stopPropagation();
      const contentNode = getFrameSyntheticNode(frame, state.documents);
      state = updateEditorWindow(
        { smooth: false },
        getPCNodeDependency(
          getSyntheticSourceNode(contentNode, state.graph).id,
          state.graph
        ).uri,
        state
      );
      return handleArtboardSelectionFromAction(
        state,
        frame.contentNodeId,
        action as CanvasToolArtboardTitleClicked
      );
    }
    case PROPERTY_BINDING_UPDATED: {
      const {
        fromPropertyName,
        toPropertyName,
        index
      } = action as PropertyBindingUpdated;
      const selectedNode = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      );
      state = persistRootState(state => {
        return persistUpdatePropertyBinding(
          { from: fromPropertyName, to: toPropertyName },
          index,
          selectedNode,
          state
        );
      }, state);

      return state;
    }
    case PROPERTY_BINDING_ADD_BUTTON_CLICKED: {
      const selectedNode = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      );
      state = persistRootState(state => {
        return persistAddPropertyBinding(selectedNode, state);
      }, state);

      return state;
    }
    case PROPERTY_BINDING_REMOVE_BUTTON_CLICKED: {
      const { index } = action as PropertyBindingRemoveButtonClicked;
      const selectedNode = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      );
      state = persistRootState(state => {
        return persistRemovePropertyBinding(index, selectedNode, state);
      }, state);

      return state;
    }
    case CANVAS_TOOL_WINDOW_BACKGROUND_CLICKED: {
      return setSelectedSyntheticVisibleNodeIds(state);
    }
    case COMPONENT_CONTROLLER_PICKED: {
      const { filePath } = action as ComponentControllerPicked;
      const node = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      );
      state = persistRootState(
        state => persistAddComponentController(filePath, node, state),
        state
      );
      return state;
    }
    case REMOVE_COMPONENT_CONTROLLER_BUTTON_CLICKED: {
      const node = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      );
      state = persistRemoveComponentController(
        state.selectedControllerRelativePath,
        node,
        state
      );
      return state;
    }
    case INSERT_TOOL_FINISHED: {
      let { point, fileUri } = action as InsertToolFinished;
      const editor = getEditorWithActiveFileUri(fileUri, state);

      const toolType = state.toolType;

      switch (toolType) {
        case ToolType.COMPONENT: {
          const componentId = state.selectedComponentId;
          state = { ...state, selectedComponentId: null };
          const component = getPCNode(componentId, state.graph);

          return persistInsertNodeFromPoint(
            createPCComponentInstance(
              componentId,
              null,
              null,
              null,
              component.metadata
            ),
            fileUri,
            point,
            state
          );
        }
        case ToolType.ELEMENT: {
          return persistInsertNodeFromPoint(
            createPCElement(
              "div",
              { "box-sizing": "border-box", display: "block" },
              null,
              null,
              "Element"
            ),
            fileUri,
            point,
            state
          );
        }

        case ToolType.TEXT: {
          return persistInsertNodeFromPoint(
            createPCTextNode("Click to edit", "Text"),
            fileUri,
            point,
            state
          );
        }
      }
    }
  }

  return state;
};

const isJavaScriptFile = (file: string) => /(ts|js)x?$/.test(file);

const INSERT_ARTBOARD_WIDTH = 100;
const INSERT_ARTBOARD_HEIGHT = 100;

const persistInsertNodeFromPoint = (
  node: PCVisibleNode,
  fileUri: string,
  point: Point,
  state: RootState
) => {
  const oldState = state;
  const targetNodeId = getCanvasMouseTargetNodeIdFromPoint(
    state,
    point,
    getInsertFilter(state)
  );
  let targetNode: SyntheticVisibleNode | SyntheticDocument =
    targetNodeId && getSyntheticNodeById(targetNodeId, state.documents);

  if (!targetNode) {
    const newPoint = shiftPoint(
      normalizePoint(getOpenFile(fileUri, state).canvas.translate, point),
      {
        left: -(INSERT_ARTBOARD_WIDTH / 2),
        top: -(INSERT_ARTBOARD_HEIGHT / 2)
      }
    );

    let bounds = {
      left: 0,
      top: 0,
      right: INSERT_ARTBOARD_WIDTH,
      bottom: INSERT_ARTBOARD_HEIGHT,
      ...(node.metadata[PCVisibleNodeMetadataKey.BOUNDS] || {})
    };

    bounds = moveBounds(bounds, newPoint);

    node = updatePCNodeMetadata(
      {
        [PCVisibleNodeMetadataKey.BOUNDS]: bounds
      },
      node
    );

    targetNode = getSyntheticDocumentByDependencyUri(
      fileUri,
      state.documents,
      state.graph
    );
  }

  state = persistRootState(state => {
    return persistInsertNode(node, targetNode, TreeMoveOffset.APPEND, state);
  }, state);

  state = setTool(null, state);

  state = queueSelectInsertedSyntheticVisibleNodes(oldState, state, targetNode);

  return state;
};

const getDragFilter = (item: any, state: RootState) => {
  // TODO - filter should check if is slot
  let filter = getInsertFilter(state);

  if (isFile(item) && isJavaScriptFile(item.uri)) {
    filter = (node: SyntheticVisibleNode) => {
      return (
        node.isContentNode &&
        node.isCreatedFromComponent &&
        !node.isComponentInstance
      );
    };
  } else if (isInspectorNode(item)) {
    const sourceNode = getPCNode(item.assocSourceNodeId, state.graph);
    if (sourceNode.name === PCSourceTagNames.COMPONENT) {
      return () => false;
    }
  }

  return filter;
};

const getInsertFilter = (state: RootState) => {
  const isSlottableElement = filterSlottableElement(state);
  let filter = (node: SyntheticVisibleNode) =>
    node.name !== PCSourceTagNames.TEXT &&
    node.name !== PCSourceTagNames.COMPONENT_INSTANCE &&
    (!syntheticNodeIsInShadow(
      node,
      getSyntheticVisibleNodeDocument(node.id, state.documents),
      state.graph
    ) ||
      isSlottableElement(node));

  return filter;
};

const filterSlottableElement = (state: RootState) => {
  return (node: SyntheticVisibleNode) => {
    const sourceNode = getSyntheticSourceNode(node, state.graph);
    if (
      sourceNode.name !== PCSourceTagNames.ELEMENT &&
      sourceNode.name !== PCSourceTagNames.COMPONENT_INSTANCE
    ) {
      return false;
    }
    const childBinding = (
      (sourceNode.bind && sourceNode.bind.properties) ||
      EMPTY_ARRAY
    ).find(binding => binding.to === PCOverridablePropertyName.CHILDREN);
    if (!childBinding) {
      return false;
    }

    const instancePath = getSyntheticInstancePath(
      node,
      getSyntheticVisibleNodeDocument(node.id, state.documents),
      state.graph
    );
    let currentBinding = childBinding;

    for (let i = instancePath.length - 1; i--; ) {
      const instance = getPCNode(
        instancePath[i],
        state.graph
      ) as PCComponentInstanceElement;
      currentBinding = (
        (instance.bind && instance.bind.properties) ||
        EMPTY_ARRAY
      ).find(binding => binding.to === currentBinding.from);
      if (!currentBinding) {
        return false;
      }
    }

    return true;
  };
};

const setFileExpanded = (node: FSItem, value: boolean, state: RootState) => {
  state = updateRootState(
    {
      projectDirectory: updateNestedNode(
        node,
        state.projectDirectory,
        (node: FSItem) => ({
          ...node,
          expanded: value
        })
      )
    },
    state
  );
  return state;
};

const getNewSyntheticVisibleNodeBounds = (
  newBounds: Bounds,
  node: SyntheticVisibleNode,
  state: RootState
) => {
  const currentBounds = getSelectionBounds(state);
  const innerBounds = getSyntheticVisibleNodeRelativeBounds(node, state.frames);
  return scaleInnerBounds(innerBounds, currentBounds, newBounds);
};

const handleLoadedDroppedItem = (
  item,
  point: Point,
  editorUri: string,
  state: RootState,
  content?: Buffer
) => {
  const targetNodeId = getCanvasMouseTargetNodeIdFromPoint(
    state,
    point,
    getDragFilter(item, state)
  );

  let sourceNode: PCVisibleNode;

  if (isFile(item)) {
    let src = path.relative(path.dirname(editorUri), item.uri);

    if (src.charAt(0) !== ".") {
      src = "./" + src;
    }

    if (isImageUri(item.uri)) {
      sourceNode = createPCElement(
        "img",
        {},
        {
          src
        }
      );
      if (isSvgUri(item.uri)) {
        const source = content.toString("utf8");
        sourceNode = xmlToPCNode(source);
      }
    } else if (isJavaScriptFile(item.uri)) {
      return persistRootState(state => {
        return persistAddComponentController(
          (item as FSItem).uri,
          getSyntheticNodeById(targetNodeId, state.documents),
          state
        );
      }, state);
    }
  } else if (isInspectorNode(item)) {
    sourceNode = getSyntheticSourceNode(
      getInspectorSyntheticNode(item, state.documents, state.graph),
      state.graph
    ) as PCVisibleNode;
  } else {
    sourceNode = cloneTreeNode((item as RegisteredComponent).template);
  }

  if (!sourceNode) {
    console.error(`Unrecognized dropped item.`);
    return state;
  }

  const targetId = getCanvasMouseTargetNodeIdFromPoint(
    state,
    point,
    node => node.name !== PCSourceTagNames.TEXT
  );
  let target: SyntheticVisibleNode | SyntheticDocument = targetId
    ? getSyntheticNodeById(targetId, state.documents)
    : getSyntheticDocumentByDependencyUri(
        editorUri,
        state.documents,
        state.graph
      );

  if (target.name === SYNTHETIC_DOCUMENT_NODE_NAME) {
    sourceNode = updatePCNodeMetadata(
      {
        [PCVisibleNodeMetadataKey.BOUNDS]: moveBounds(
          sourceNode.metadata[PCVisibleNodeMetadataKey.BOUNDS] ||
            DEFAULT_FRAME_BOUNDS,
          point
        )
      },
      sourceNode
    );
  }

  return persistRootState(
    browser =>
      persistInsertNode(sourceNode, target, TreeMoveOffset.APPEND, browser),
    state
  );
};

const getResizeActionBounds = (action: ResizerPathMoved | ResizerMoved) => {
  let {
    anchor,
    originalBounds,
    newBounds,
    sourceEvent
  } = action as ResizerPathMoved;

  const keepAspectRatio = sourceEvent.shiftKey;
  const keepCenter = sourceEvent.altKey;

  if (keepCenter) {
    // TODO - need to test. this might not work
    newBounds = keepBoundsCenter(newBounds, originalBounds, anchor);
  }

  if (keepAspectRatio) {
    newBounds = keepBoundsAspectRatio(
      newBounds,
      originalBounds,
      anchor,
      keepCenter ? { left: 0.5, top: 0.5 } : anchor
    );
  }

  return newBounds;
};

const isInputSelected = (state: RootState) => {
  // ick -- this needs to be moved into a saga
  return (
    document.activeElement &&
    /textarea|input|button/i.test(document.activeElement.tagName)
  );
};

const shortcutReducer = (state: RootState, action: Action): RootState => {
  switch (action.type) {
    case SHORTCUT_QUICK_SEARCH_KEY_DOWN: {
      return isInputSelected(state)
        ? state
        : updateRootState(
            {
              showQuickSearch: !state.showQuickSearch
            },
            state
          );
    }
    case SHORTCUT_UNDO_KEY_DOWN: {
      return undo(state);
    }
    case SHORTCUT_REDO_KEY_DOWN: {
      return redo(state);
    }
    case SHORTCUT_T_KEY_DOWN: {
      return isInputSelected(state) ? state : setTool(ToolType.TEXT, state);
    }
    case SHORTCUT_R_KEY_DOWN: {
      return isInputSelected(state) ? state : setTool(ToolType.ELEMENT, state);
    }
    case SHORTCUT_C_KEY_DOWN: {
      return isInputSelected(state)
        ? state
        : setTool(ToolType.COMPONENT, state);
    }
    case SHORTCUT_CONVERT_TO_COMPONENT_KEY_DOWN: {
      // TODO - should be able to conver all selected nodes to components
      if (state.selectedNodeIds.length > 1) {
        return state;
      }

      const oldState = state;

      state = persistRootState(
        state =>
          persistConvertNodeToComponent(
            getSyntheticNodeById(state.selectedNodeIds[0], state.documents),
            state
          ),
        state
      );

      state = setSelectedSyntheticVisibleNodeIds(state);

      state = queueSelectInsertedSyntheticVisibleNodes(
        oldState,
        state,
        getSyntheticDocumentByDependencyUri(
          state.activeEditorFilePath,
          state.documents,
          state.graph
        )
      );
      return state;
    }
    case SHORTCUT_ESCAPE_KEY_DOWN: {
      if (isInputSelected(state)) {
        return state;
      }
      if (state.toolType != null) {
        return setTool(null, state);
      } else {
        state = setSelectedSyntheticVisibleNodeIds(state);
        state = setSelectedFileNodeIds(state);
        state = updateRootState({ insertFileInfo: null }, state);
        return state;
      }
    }
    case SHORTCUT_DELETE_KEY_DOWN: {
      if (isInputSelected(state) || state.selectedNodeIds.length === 0) {
        return state;
      }
      const firstNode = getSyntheticNodeById(
        state.selectedNodeIds[0],
        state.documents
      );

      if (!canRemoveSyntheticVisibleNode(firstNode, state)) {
        return confirm(
          "Please remove all instances of component before deleting it.",
          ConfirmType.ERROR,
          state
        );
      }

      const document = getSyntheticVisibleNodeDocument(
        firstNode.id,
        state.documents
      );

      let parent = getParentTreeNode(firstNode.id, document);
      const index = parent.children.indexOf(firstNode);

      state = persistRootState(state => {
        return state.selectedNodeIds.reduce((state, nodeId) => {
          return persistRemoveSyntheticVisibleNode(
            getSyntheticNodeById(nodeId, state.documents),
            state
          );
        }, state);
      }, state);

      parent = getSyntheticNodeById(parent.id, state.documents);

      state = setSelectedSyntheticVisibleNodeIds(
        state,
        ...(parent.children.length
          ? [parent.children[Math.min(index, parent.children.length - 1)].id]
          : parent.name !== SYNTHETIC_DOCUMENT_NODE_NAME
            ? [parent.id]
            : [])
      );
    }
  }
  return state;
};

const clipboardReducer = (state: RootState, action: Action) => {
  switch (action.type) {
    case SYNTHETIC_NODES_PASTED: {
      const { clips } = action as SyntheticVisibleNodesPasted;
      const oldState = state;

      let offset: TreeMoveOffset = TreeMoveOffset.BEFORE;
      let targetNode: SyntheticVisibleNode | SyntheticDocument;
      let scopeNode: SyntheticVisibleNode | SyntheticDocument;

      if (state.selectedNodeIds.length) {
        const nodeId = state.selectedNodeIds[0];
        scopeNode = targetNode = getSyntheticNodeById(nodeId, state.documents);
        scopeNode = getParentTreeNode(
          scopeNode.id,
          getSyntheticVisibleNodeDocument(scopeNode.id, state.documents)
        );
      } else {
        offset = TreeMoveOffset.PREPEND;
        scopeNode = targetNode = getSyntheticDocumentByDependencyUri(
          state.activeEditorFilePath,
          state.documents,
          state.graph
        );
      }

      state = persistRootState(
        state => persistAppendPCClips(clips, targetNode, offset, state),
        state
      );

      state = queueSelectInsertedSyntheticVisibleNodes(
        oldState,
        state,
        scopeNode
      );

      return state;
    }
  }

  return state;
};

const handleArtboardSelectionFromAction = <
  T extends { sourceEvent: React.MouseEvent<any> }
>(
  state: RootState,
  nodeId: string,
  event: T
) => {
  const { sourceEvent } = event;
  state = setRootStateSyntheticVisibleNodeExpanded(nodeId, true, state);
  state = setSelectedSyntheticVisibleNodeIds(state, nodeId);
  return state;
};

const setCanvasZoom = (
  zoom: number,
  smooth: boolean = true,
  uri: string,
  state: RootState
) => {
  const editorWindow = getEditorWindowWithFileUri(uri, state);
  const openFile = getOpenFile(uri, state);
  return updateOpenFileCanvas(
    {
      translate: centerTransformZoom(
        openFile.canvas.translate,
        editorWindow.container.getBoundingClientRect(),
        clamp(zoom, MIN_ZOOM, MAX_ZOOM),
        editorWindow.mousePosition
      )
    },
    uri,
    state
  );
};

const normalizeBounds = (translate: Translate, bounds: Bounds) => {
  return zoomBounds(
    shiftBounds(bounds, {
      left: -translate.left,
      top: -translate.top
    }),
    1 / translate.zoom
  );
};

const normalizePoint = (translate: Translate, point: Point) => {
  return zoomPoint(
    shiftPoint(point, {
      left: -translate.left,
      top: -translate.top
    }),
    1 / translate.zoom
  );
};

const normalizeZoom = zoom => {
  return zoom < 1 ? 1 / Math.round(1 / zoom) : Math.round(zoom);
};
