import { Action } from "redux";
import { DesktopState } from "../state";
import { PC_CONFIG_LOADED, pcConfigLoaded, PCConfigLoaded } from "../actions";

export const rootReducer = (
  state: DesktopState,
  action: Action
): DesktopState => {
  switch (action.type) {
    case PC_CONFIG_LOADED: {
      const { config } = action as PCConfigLoaded;
      return { ...state, pcConfig: config };
    }
  }
  return state;
};
