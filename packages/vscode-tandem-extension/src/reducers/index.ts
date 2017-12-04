import { ExtensionState, updateExtensionState, getFileCacheContent, getFileCacheMtime } from "../state";
import { isPaperclipFile } from "../utils";
import { CHILD_DEV_SERVER_STARTED, ChildDevServerStarted, FileContentChanged, FILE_CONTENT_CHANGED, FILE_REMOVED, FileAction, TEXT_CONTENT_CHANGED, EXPRESS_SERVER_STARTED, ExpressServerStarted, ACTIVE_TEXT_EDITOR_CHANGED, ActiveTextEditorChanged, MODULE_CREATED } from "../actions";
import { Action } from "redux";

export function mainReducer(state: ExtensionState, action: Action) {
  switch(action.type) {
    case EXPRESS_SERVER_STARTED: {
      const { port } = action as ExpressServerStarted;
      return updateExtensionState(state, {
        port,
      });
    }
    case CHILD_DEV_SERVER_STARTED: {
      const { port } = action as ChildDevServerStarted;
      return updateExtensionState(state, {
        childDevServerInfo: { 
          port
        }
      });
    }
    case ACTIVE_TEXT_EDITOR_CHANGED: {
      const { editor } = action as ActiveTextEditorChanged;
      return updateExtensionState(state, {
        activeTextEditor: editor
      });
    }
    case FILE_REMOVED: {
      const { filePath } = action as FileAction;
      return updateExtensionState(state, {
        fileCache: {
          ...state.fileCache,
          [filePath]: undefined
        }
      })
    }

    case MODULE_CREATED:
    case TEXT_CONTENT_CHANGED: 
    case FILE_CONTENT_CHANGED: {
      let { filePath, content, mtime } = action as FileContentChanged;
      
      // cast as date in case that it isn't
      mtime = new Date(mtime);

      if (!isPaperclipFile(filePath) || (getFileCacheMtime(filePath, state) && getFileCacheMtime(filePath, state).getTime() > mtime.getTime())) {
        return state;
      }
      
      return updateExtensionState(state, {
        fileCache: {
          ...state.fileCache,
          [filePath]: {
            content,
            mtime,
          }
        }
      })
    }
  }
  return state;
}