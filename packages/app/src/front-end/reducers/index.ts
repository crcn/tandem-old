import { Action } from "redux";
import { PROJECT_LOADED, ProjectLoaded, SYNTHETIC_WINDOW_OPENED, CanvasToolOverlayMouseMoved, SyntheticWindowOpened, PROJECT_DIRECTORY_LOADED, ProjectDirectoryLoaded, FILE_NAVIGATOR_ITEM_CLICKED, FileNavigatorItemClicked, DEPENDENCY_ENTRY_LOADED, DependencyEntryLoaded, DOCUMENT_RENDERED, DocumentRendered, CANVAS_WHEEL, CANVAS_MOUSE_MOVED, CANVAS_MOUSE_CLICKED, WrappedEvent, CanvasToolOverlayClicked } from "../actions";
import { RootState, setActiveFilePath, updateRootState, updateRootStateSyntheticBrowser, updateRootStateSyntheticWindow, updateRootStateSyntheticWindowDocument, updateCanvas, getCanvasMouseNodeTargetReference } from "../state";
import { updateSyntheticBrowser, addSyntheticWindow, createSyntheticWindow, SyntheticNode, evaluateDependencyEntry, createSyntheticDocument, getSyntheticWindow } from "paperclip";
import { getTeeNodePath, getTreeNodeFromPath, getFilePath, File, getFilePathFromNodePath, EMPTY_OBJECT, TreeNode } from "common";

export const rootReducer = (state: RootState, action: Action) => {
  switch(action.type) {
    case PROJECT_DIRECTORY_LOADED: {
      const { directory } = action as ProjectDirectoryLoaded;
      return updateRootState({ projectDirectory: directory }, state);
    }
    case FILE_NAVIGATOR_ITEM_CLICKED: {
      const { path } = action as FileNavigatorItemClicked;
      const filePath = getFilePathFromNodePath(path, state.projectDirectory);
      const window = createSyntheticWindow(filePath);
      state = updateRootState({
        browser: addSyntheticWindow(window, state.browser)
      }, state);
      return setActiveFilePath(window.location, state);
    }
    case DEPENDENCY_ENTRY_LOADED: {
      const { entry, graph } = action as DependencyEntryLoaded;

      state = updateRootStateSyntheticBrowser({
        graph: {
          ...(state.browser.graph || EMPTY_OBJECT),
          ...graph
        }
      }, state);

      const documents = evaluateDependencyEntry({ entry, graph }).componentPreviews.map(root => {
        return createSyntheticDocument(root, graph);
      });

      return updateRootStateSyntheticWindow(entry.uri, {
        documents,
      }, state);
    }
    case DOCUMENT_RENDERED: {
      const { info, documentIndex, window } = action as DocumentRendered;
      const win = getSyntheticWindow(window.location, state.browser);
      return updateRootStateSyntheticWindowDocument(window.location, documentIndex, {
        computed: info
      }, state);
    }

    // TODO
    //  case RESIZER_MOVED: {
    //   const { point, workspaceId, point: newPoint } = event as ResizerMoved;
    //   const workspace = getSelectedWorkspace(state);
    //   state = updateWorkspaceStage(state, workspace.$id, {
    //     movingOrResizing: true
    //   });

    //   const translate = getStageTranslate(workspace.stage);

    //   const selectionBounds = getWorkspaceSelectionBounds(workspace);
    //   for (const item of getBoundedWorkspaceSelection(workspace)) {
    //     const itemBounds = getWorkspaceItemBounds(item, workspace);

    //     // skip moving window if in full screen mode
    //     if (workspace.stage.fullScreen && workspace.stage.fullScreen.artboardId === item.$id) {
    //       break;
    //     }

    //     const newBounds = roundBounds(scaleInnerBounds(itemBounds, selectionBounds, moveBounds(selectionBounds, newPoint)));

    //     if (item.$type === ARTBOARD) {
    //       state = updateArtboard(state, item.$id, { bounds: newBounds });
    //     }
    //   }

    //   return state;

    // }

    case CANVAS_MOUSE_MOVED: {
      const { sourceEvent: { pageX, pageY }} = action as WrappedEvent<React.MouseEvent<any>>;
      state = updateCanvas({ mousePosition: { left: pageX, top: pageY }}, state);

      // TODO - in the future, we'll probably want to be able to highlight hovered nodes as the user is moving an element around to indicate where
      // they can drop the element.

      const targetRef = state.canvas.movingOrResizing ? null : getCanvasMouseNodeTargetReference(state, action as CanvasToolOverlayMouseMoved);

      state = updateRootState({
        hoveringReferences: targetRef ? [targetRef] : []
      }, state);

      return state;
    };

    // TODO
    // case CANVAS_MOUSE_CLICKED: {
    //   const { sourceEvent } = action as CanvasToolOverlayClicked;
    //   if (/textarea|input/i.test((sourceEvent.target as Element).nodeName)) {
    //     return state;
    //   }

    //   // alt key opens up a new link
    //   const altKey = sourceEvent.altKey;
    //   state = updateWorkspaceStageSmoothing(state, workspace);

    //   // do not allow selection while window is panning (scrolling)
    //   if (workspace.stage.panning || workspace.stage.movingOrResizing) return state;

    //   const targetRef = getStageToolMouseNodeTargetReference(state, event as StageToolNodeOverlayClicked);
    //   if (!targetRef) {
    //     return state;
    //   }

    //   if (!altKey) {
    //     state = handleArtboardSelectionFromAction(state, targetRef, event as StageToolNodeOverlayClicked);
    //     state = updateWorkspaceStage(state, workspace.$id, {
    //       secondarySelection: false
    //     });
    //     return state;
    //   }
    //   return state;
    // }
  }
  return state;
};
