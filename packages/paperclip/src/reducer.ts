import { Action } from "redux";
import {
  PC_SYNTHETIC_FRAME_RENDERED,
  PCSyntheticFrameRendered,
  PCDependencyLoaded,
  PC_DEPENDENCY_LOADED,
  PC_SYNTHETIC_FRAME_CONTAINER_CREATED,
  PCSyntheticFrameContainerCreated
} from "./actions";
import { evaluatePCModule } from "./evaluate";
import {
  updateSyntheticNode,
  PCState,
  updatePCState,
  updateSyntheticFrame,
  evaluateDependency
} from "./state";
import { updateSyntheticFrames } from "./synthetic";

export const paperclipReducer = <TState extends PCState>(
  state: TState,
  action: Action
): TState => {
  switch (action.type) {
    case PC_SYNTHETIC_FRAME_CONTAINER_CREATED: {
      const { frame, $container } = action as PCSyntheticFrameContainerCreated;
      return updateSyntheticFrame(
        {
          $container,
          computed: null
        },
        frame,
        state
      );
    }
    case PC_SYNTHETIC_FRAME_RENDERED: {
      const { frame, computed } = action as PCSyntheticFrameRendered;
      return updateSyntheticFrame(
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
        updatePCState(
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
      // return evaluateDependency(uri, {
      //   openDependencyUri:
      // })
      // return updatePCState(
      //   {
      //     openDependencyUri: null,
      //     graph,
      //     syntheticFrames: updateSyntheticFrames(
      //       state.syntheticFrames,
      //       evaluatePCModule(module, graph)
      //     )
      //   },
      //   state
      // );
    }
  }
  return state;
};
