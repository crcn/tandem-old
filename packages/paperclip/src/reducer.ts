import { PaperclipRoot, updatePaperclipRootState } from "./external-state";
import { Action } from "redux";
import {
  PC_SYNTHETIC_FRAME_RENDERED,
  PCSyntheticFrameRendered,
  PCDependencyLoaded,
  PC_DEPENDENCY_LOADED,
  PC_SYNTHETIC_FRAME_CONTAINER_DESTROYED,
  PCSyntheticFrameContainerDestroyed,
  PC_SYNTHETIC_FRAME_CONTAINER_CREATED,
  PCSyntheticFrameContainerCreated
} from "./actions";
import { updateSyntheticFrame } from "./external-state";
import { mergeSyntheticFrames } from "./synthetic";
import { evaluatePCModule } from "./evaluate";

export const paperclipReducer = <TState extends PaperclipRoot>(
  state: TState,
  action: Action
): TState => {
  switch (action.type) {
    case PC_SYNTHETIC_FRAME_CONTAINER_DESTROYED: {
      const { frame } = action as PCSyntheticFrameContainerDestroyed;
      return updateSyntheticFrame(
        {
          $container: null,
          computed: null
        },
        frame.source.nodeId,
        state
      );
    }
    case PC_SYNTHETIC_FRAME_CONTAINER_CREATED: {
      const { frame, $container } = action as PCSyntheticFrameContainerCreated;
      return updateSyntheticFrame(
        {
          $container,
          computed: null
        },
        frame.source.nodeId,
        state
      );
    }
    case PC_SYNTHETIC_FRAME_RENDERED: {
      const { frame, computed } = action as PCSyntheticFrameRendered;
      return updateSyntheticFrame(
        {
          computed
        },
        frame.source.nodeId,
        state
      );
    }
    case PC_DEPENDENCY_LOADED: {
      const { uri, graph } = action as PCDependencyLoaded;
      const module = graph[uri].content;
      return updatePaperclipRootState(
        {
          openDependencyUri: null,
          graph,
          syntheticFrames: mergeSyntheticFrames(
            state.paperclip.syntheticFrames,
            evaluatePCModule(module, graph)
          )
        },
        state
      );
    }
  }
  return state;
};
