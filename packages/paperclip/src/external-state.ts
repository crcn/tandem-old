import { Dependency, DependencyGraph } from "./graph";
import { PCDependency, PCNode } from "./dsl";
import {
  SyntheticElement,
  SyntheticTextNode,
  SyntheticFrame,
  SyntheticFrames,
  PaperclipState
} from "./synthetic";
import { KeyValue, EMPTY_OBJECT } from "tandem-common";

// namespaced to ensure that key doesn't conflict with others
export type PaperclipRoot = {
  paperclip: PaperclipState;
};

export type PCNodeClip = {
  uri: string;
  node: PCNode;
  imports: string[];
};

export const updatePaperclipRootState = <TState extends PaperclipRoot>(
  properties: Partial<PaperclipState>,
  root: TState
): TState => ({
  ...(root as any),
  paperclip: {
    ...root.paperclip,
    ...properties
  }
});

export const updateSyntheticFrame = <TState extends PaperclipRoot>(
  properties: Partial<SyntheticFrame>,
  sourceFrameId: string,
  state: TState
) =>
  updatePaperclipRootState(
    {
      syntheticFrames: {
        ...state.paperclip.syntheticFrames,
        [sourceFrameId]: {
          ...(state.paperclip.syntheticFrames[sourceFrameId] || EMPTY_OBJECT),
          ...properties
        }
      }
    },
    state
  );

export const replaceDependency = <TState extends PaperclipRoot>(
  dep: Dependency<any>,
  state: TState
) => updateDependencyGraph({ [dep.uri]: dep }, state);

export const updateDependencyGraph = <TState extends PaperclipRoot>(
  properties: Partial<DependencyGraph>,
  state: TState
) =>
  updatePaperclipRootState(
    {
      graph: {
        ...state.paperclip.graph,
        ...properties
      }
    },
    state
  );

export const queueLoadDependencyUri = <TState extends PaperclipRoot>(
  uri: string,
  state: TState
) =>
  state.paperclip.graph[uri]
    ? state
    : updatePaperclipRootState({ openDependencyUri: uri }, state);
