import { memoize } from "tandem-common";
import { PCModule } from "dsl";

export type DependencyGraph = {
  [identifier: string]: Dependency<any>;
};

export type Dependency<TContent> = {
  // URI used here since it could be a url
  uri: string;
  dirty?: boolean; // TRUE if the contents have changed
  originalContent: TContent;
  content: TContent;
  importUris: {
    [identifier: string]: string;
  };
};

export const getDependents = memoize((uri: string, graph: DependencyGraph) => {
  const dependents = [];

  for (const depUri in graph) {
    if (depUri === uri) {
      continue;
    }

    const dep = graph[depUri];

    for (const relativePath in dep.importUris) {
      const importedUri = dep.importUris[relativePath];
      if (importedUri === uri) {
        dependents.push(dep);
        continue;
      }
    }
  }

  return dependents;
});

export const updateGraphDependency = (
  properties: Partial<Dependency<any>>,
  uri: string,
  graph: DependencyGraph
) => ({
  ...graph,
  [uri]: {
    ...graph[uri],
    ...properties
  }
});
