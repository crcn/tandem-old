import { Dependency, DependencyGraph } from "./graph";
import { PCDependency } from "./dsl";
import {
  SyntheticElement,
  SyntheticTextNode,
  SyntheticFrame,
  SyntheticFrames
} from "./synthetic";
import { KeyValue } from "tandem-common";

// namespaced to ensure that key doesn't conflict with others
export type PaperclipRoot = {
  paperclip: PaperclipState;
};

// what reducer stuff actally access
export type PaperclipState = {
  // key = frame id, value = evaluated frame
  syntheticFrames: SyntheticFrames;

  graph: DependencyGraph;
};
