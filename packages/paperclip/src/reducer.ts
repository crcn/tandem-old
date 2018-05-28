import { PaperclipRoot, updateRootPaperclipState } from "./external-state";
import { Action } from "redux";
import {
  PC_SYNTHETIC_FRAME_RENDERED,
  PCSyntheticFrameRendered
} from "./actions";
import { updateSyntheticFrame } from "./synthetic";

export const paperclipReducer = (state: PaperclipRoot, action: Action) => {
  switch (action.type) {
    case PC_SYNTHETIC_FRAME_RENDERED: {
      const {
        frame,
        $container,
        computed
      } = action as PCSyntheticFrameRendered;
      return updateRootPaperclipState(
        updateSyntheticFrame(
          {
            computed,
            $container
          },
          frame.source.nodeId,
          state.paperclip
        ),
        state
      );
    }
  }
  return state;
};
