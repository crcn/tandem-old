import { ExtensionState, updateExtensionState, getFileCacheContent } from "../state";
import { CHILD_DEV_SERVER_STARTED, ChildDevServerStarted, FileContentChanged, FILE_CONTENT_CHANGED, FileAction, TEXT_CONTENT_CHANGED, EXPRESS_SERVER_STARTED, ExpressServerStarted, ACTIVE_TEXT_EDITOR_CHANGED, ActiveTextEditorChanged } from "../actions";
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
    case TEXT_CONTENT_CHANGED: 
    case FILE_CONTENT_CHANGED: {
      const { filePath, content, mtime } = action as FileContentChanged;
      
      // ignore the LIES!!
      if (content && getFileCacheContent(filePath, state) && getFileCacheContent(filePath, state).toString("utf8") === content.toString("utf8")) {
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