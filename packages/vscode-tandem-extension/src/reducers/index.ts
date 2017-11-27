import { ExtensionState, updateExtensionState, getFileCacheContent } from "../state";
import { VisualDevConfigLoaded, VISUAL_DEV_CONFIG_LOADED, CHILD_DEV_SERVER_STARTED, ChildDevServerStarted, FileContentChanged, FILE_CONTENT_CHANGED, FileAction, TEXT_CONTENT_CHANGED } from "../actions";
import { Action } from "redux";

export function mainReducer(state: ExtensionState, action: Action) {
  switch(action.type) {
    case VISUAL_DEV_CONFIG_LOADED: {
      const { config } = action as VisualDevConfigLoaded;
      return updateExtensionState(state, {
        visualDevConfig: config
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