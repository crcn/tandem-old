import { Action } from "redux";
import { DesktopState } from "../state";
import {
  PC_CONFIG_LOADED,
  pcConfigLoaded,
  PCConfigLoaded,
  TD_CONFIG_LOADED,
  TDConfigLoaded,
  PREVIEW_SERVER_STARTED,
  PreviewServerStarted
} from "../actions";

export const rootReducer = (
  state: DesktopState,
  action: Action
): DesktopState => {
  switch (action.type) {
    case PC_CONFIG_LOADED: {
      const { config: pcConfig } = action as PCConfigLoaded;
      return { ...state, pcConfig };
    }
    case TD_CONFIG_LOADED: {
      const { config: tdConfig } = action as TDConfigLoaded;
      return { ...state, tdConfig };
    }
    case PREVIEW_SERVER_STARTED: {
      const { port } = action as PreviewServerStarted;
      return {
        ...state,
        info: {
          ...state.info,
          previewServer: {
            port
          }
        }
      };
    }
  }
  return state;
};
