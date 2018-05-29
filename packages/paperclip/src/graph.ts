import { memoize } from "tandem-common";

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

export const getModifiedDependencies = (
  newGraph: DependencyGraph,
  oldGraph: DependencyGraph
) => {
  const modified: Dependency<any>[] = [];
  for (const uri in oldGraph) {
    if (newGraph[uri] && newGraph[uri].content !== oldGraph[uri].content) {
      modified.push(newGraph[uri]);
    }
  }
  return modified;
};
