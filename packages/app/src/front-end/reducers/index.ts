import { Action } from "redux";
import { TEST_PROJECT_LOADED, TestProjectLoaded } from "../actions";
import { RootState, addOpenedProject } from "../state";

export const rootReducer = (state: RootState, action: Action) => {
  state = projectReducer(state, action);
  return state;
};

const projectReducer = (state: RootState, action: Action) => {
  switch(action.type) {
    case TEST_PROJECT_LOADED: {
      const { file } = action as TestProjectLoaded;
      state = addOpenedProject(state, file);
      break;
    }
  }
  console.log(state);

  return state;
};