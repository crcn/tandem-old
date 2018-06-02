import { Action } from "redux";
import {
  PC_SYNTHETIC_FRAME_RENDERED,
  PCFrameRendered,
  PCDependencyLoaded,
  PC_DEPENDENCY_LOADED,
  PC_SYNTHETIC_FRAME_CONTAINER_CREATED,
  PCFrameContainerCreated
} from "./actions";
import { evaluatePCModule } from "./evaluate";
import {
  updateSyntheticVisibleNode,
  PCEditorState,
  updatePCEditorState,
  updateFrame,
  evaluateDependency
} from "./edit";

export const paperclipReducer = <TState extends PCEditorState>(
  state: TState,
  action: Action
): TState => {
  switch (action.type) {
    case PC_SYNTHETIC_FRAME_CONTAINER_CREATED: {
      const { frame, $container } = action as PCFrameContainerCreated;
      return updateFrame(
        {
          $container,
          computed: null
        },
        frame,
        state
      );
    }
    case PC_SYNTHETIC_FRAME_RENDERED: {
      const { frame, computed } = action as PCFrameRendered;
      return updateFrame(
        {
          computed
        },
        frame,
        state
      );
    }
    case PC_DEPENDENCY_LOADED: {
      const { uri, graph } = action as PCDependencyLoaded;
      return evaluateDependency(
        uri,
        updatePCEditorState(
          {
            openDependencyUri: null,
            graph: {
              ...state.graph,
              ...graph
            }
          },
          state
        )
      );
    }
  }
  return state;
};
