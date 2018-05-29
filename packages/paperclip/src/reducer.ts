import { PaperclipRoot, updatePaperclipRootState } from "./external-state";
import { Action } from "redux";
import {
  PC_SYNTHETIC_FRAME_RENDERED,
  PCSyntheticFrameRendered,
  PCDependencyLoaded,
  PC_DEPENDENCY_LOADED
} from "./actions";
import { updateSyntheticFrame } from "./external-state";
import { mergeSyntheticFrames } from "./synthetic";
import { evaluatePCModule } from "./evaluate";

export const paperclipReducer = <TState extends PaperclipRoot>(
  state: TState,
  action: Action
): TState => {
  switch (action.type) {
    case PC_SYNTHETIC_FRAME_RENDERED: {
      const {
        frame,
        $container,
        computed
      } = action as PCSyntheticFrameRendered;
      return updateSyntheticFrame(
        {
          computed,
          $container
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
