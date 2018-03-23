import { getImports } from "./dsl";
import { TreeNode } from "./tree-state";
import { Dependency, DependencyGraph } from "./loader-state";

export type EvaluateOptions = {
  entry: Dependency;
  graph: DependencyGraph;
};

export const evaluateEntry = (options: EvaluateOptions) => {

}