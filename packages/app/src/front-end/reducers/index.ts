import { Action } from "redux";
import { PROJECT_LOADED, ProjectLoaded, SYNTHETIC_WINDOW_OPENED, SyntheticWindowOpened } from "../actions";
import { RootState, setActiveUri, updateRootState } from "../state";
import { stat } from "fs";
import { updateSyntheticBrowser, addSyntheticWindow } from "paperclip";

export const rootReducer = (state: RootState, action: Action) => {
  state = projectReducer(state, action);
  return state;
};

const projectReducer = (state: RootState, action: Action) => {
  return state;
};

const syntheticBrowserReducer = (state: RootState, action: Action) => {
  switch(action.type) {
    case SYNTHETIC_WINDOW_OPENED: {
      const { window } = action as SyntheticWindowOpened;
      state = updateRootState({
        browser: addSyntheticWindow(window, state.browser)
      }, state);
      state = setActiveUri(window.location, state);
      break;
    }
  }
  return state;
}