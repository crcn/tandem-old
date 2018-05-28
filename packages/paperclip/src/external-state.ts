import { Dependency, DependencyGraph } from "./graph";
import { PCDependency } from "./dsl";
import {
  SyntheticElement,
  SyntheticTextNode,
  SyntheticFrame,
  SyntheticFrames,
  PaperclipState
} from "./synthetic";
import { KeyValue } from "tandem-common";

// namespaced to ensure that key doesn't conflict with others
export type PaperclipRoot = {
  paperclip: PaperclipState;
};

export const updateRootPaperclipState = (
  properties: Partial<PaperclipState>,
  root: PaperclipRoot
) => ({
  ...root,
  paperclip: {
    ...root.paperclip,
    ...properties
  }
});
