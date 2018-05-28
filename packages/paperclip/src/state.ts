import { Dependency, DependencyGraph } from "./graph";
import { PCDependency } from "./dsl";
import {
  SyntheticElement,
  SyntheticTextNode,
  SyntheticFrame
} from "./synthetic";
import { KeyValue } from "tandem-common";

export type PaperclipRootState = {
  // key = frame id, value = evaluated frame
  syntheticFrames: KeyValue<SyntheticFrame>;

  graph: DependencyGraph;
};
