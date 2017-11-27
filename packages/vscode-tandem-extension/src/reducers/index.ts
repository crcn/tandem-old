import { ExtensionState, updateExtensionState } from "../state";
import { VisualDevConfigLoaded, VISUAL_DEV_CONFIG_LOADED, CHILD_DEV_SERVER_STARTED, ChildDevServerStarted, FileContentChanged, FILE_CONTENT_CHANGED, FileAction } from "../actions";
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
  }
  return state;
}