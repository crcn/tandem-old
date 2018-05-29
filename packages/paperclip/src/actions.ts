import { ComputedDisplayInfo, SyntheticFrame } from "./synthetic";
import { Action } from "redux";
import { Dependency, DependencyGraph } from "./graph";

export const PC_SYNTHETIC_FRAME_RENDERED = "PC_SYNTHETIC_FRAME_RENDERED";
export const PC_DEPENDENCY_LOADED = "PC_DEPENDENCY_LOADED";
export const PC_SYNTHETIC_FRAME_CONTAINER_CREATED =
  "PC_SYNTHETIC_FRAME_CONTAINER_CREATED";
export const PC_SYNTHETIC_FRAME_CONTAINER_DESTROYED =
  "PC_SYNTHETIC_FRAME_CONTAINER_DESTROYED";

export type PCSyntheticFrameContainerCreated = {
  frame: SyntheticFrame;
  $container: HTMLIFrameElement;
} & Action;

export type PCSyntheticFrameContainerDestroyed = {
  frame: SyntheticFrame;
} & Action;

export type PCSyntheticFrameRendered = {
  frame: SyntheticFrame;
  computed: ComputedDisplayInfo;
} & Action;

export type PCDependencyLoaded = {
  uri: string;
  graph: DependencyGraph;
} & Action;

export const pcSyntheticFrameRendered = (
  frame: SyntheticFrame,
  computed: ComputedDisplayInfo
): PCSyntheticFrameRendered => ({
  type: PC_SYNTHETIC_FRAME_RENDERED,
  frame,
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

export const pcSyntheticFrameContainerCreated = (
  frame: SyntheticFrame,
  $container: HTMLIFrameElement
): PCSyntheticFrameContainerCreated => ({
  frame,
  $container,
  type: PC_SYNTHETIC_FRAME_CONTAINER_CREATED
});

export const pcSyntheticFrameContainerDestroyed = (
  frame: SyntheticFrame
): PCSyntheticFrameContainerDestroyed => ({
  frame,
  type: PC_SYNTHETIC_FRAME_CONTAINER_DESTROYED
});
