import { Action } from "redux";
import { PROJECT_LOADED, ProjectLoaded, SYNTHETIC_WINDOW_OPENED, SyntheticWindowOpened, PROJECT_DIRECTORY_LOADED, ProjectDirectoryLoaded, FILE_NAVIGATOR_ITEM_CLICKED, FileNavigatorItemClicked, DEPENDENCY_ENTRY_LOADED, DependencyEntryLoaded } from "../actions";
import { RootState, setActiveFilePath, updateRootState, updateRootStateSyntheticBrowser, updateRootStateSyntheticWindow } from "../state";
import { updateSyntheticBrowser, addSyntheticWindow, createSyntheticWindow, SyntheticNode, evaluateDependencyEntry } from "paperclip";
import { getTeeNodePath, getTreeNodeFromPath, getFilePath, File, getFilePathFromNodePath, EMPTY_OBJECT, TreeNode } from "common";

export const rootReducer = (state: RootState, action: Action) => {
  state = projectReducer(state, action);
  return state;
};

const projectReducer = (state: RootState, action: Action) => {
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

      state = updateRootStateSyntheticWindow(entry.uri, {
        document: evaluateDependencyEntry({ entry, graph })
      }, state);
    }
  }
  return state;
};
