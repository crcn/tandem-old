import { Action } from "redux";
import {
  PC_SYNTHETIC_FRAME_RENDERED,
  PCFrameRendered,
  PC_DEPENDENCY_GRAPH_LOADED,
  PC_SYNTHETIC_FRAME_CONTAINER_CREATED,
  PCFrameContainerCreated,
  PCDependencyGraphLoaded
} from "./actions";
import { evaluatePCModule } from "./evaluate";
import {
  updateSyntheticVisibleNode,
  PCEditorState,
  updatePCEditorState,
  updateFrame,
  evaluateDependency,
  evaluateDependencyGraph
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
    case PC_DEPENDENCY_GRAPH_LOADED: {
      const { graph } = action as PCDependencyGraphLoaded;
      return evaluateDependencyGraph(
        updatePCEditorState(
          {
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
