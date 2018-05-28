import { ComputedDisplayInfo, SyntheticFrame } from "./synthetic";
import { Action } from "redux";

export const PC_SYNTHETIC_FRAME_RENDERED = "PC_SYNTHETIC_FRAME_RENDERED";

export type PCSyntheticFrameRendered = {
  frame: SyntheticFrame;
  $container: HTMLIFrameElement;
  computed: ComputedDisplayInfo;
} & Action;

export const pcSyntheticFrameRendered = (
  frame: SyntheticFrame,
  $container: HTMLIFrameElement,
  computed: ComputedDisplayInfo
): PCSyntheticFrameRendered => ({
  type: PC_SYNTHETIC_FRAME_RENDERED,
  frame,
  $container,
  computed
});
