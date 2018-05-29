import { ComputedDisplayInfo, SyntheticFrame } from "./synthetic";
import { Action } from "redux";
import { Dependency, DependencyGraph } from "./graph";

export const PC_SYNTHETIC_FRAME_RENDERED = "PC_SYNTHETIC_FRAME_RENDERED";
export const PC_DEPENDENCY_LOADED = "PC_DEPENDENCY_LOADED";

export type PCSyntheticFrameRendered = {
  frame: SyntheticFrame;
  $container: HTMLIFrameElement;
  computed: ComputedDisplayInfo;
} & Action;

export type PCDependencyLoaded = {
  uri: string;
  graph: DependencyGraph;
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

export const pcDependencyLoaded = (
  uri: string,
  graph: DependencyGraph
): PCDependencyLoaded => ({
  uri,
  graph,
  type: PC_DEPENDENCY_LOADED
});
