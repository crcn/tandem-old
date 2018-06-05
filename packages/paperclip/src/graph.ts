import { memoize } from "tandem-common";
import { FileCache, FileCacheItem } from "fsbox";
import { PAPERCLIP_MIME_TYPE } from "./constants";
import * as migratePCModule from "paperclip-migrator";

/*------------------------------------------
 * TYPES
 *-----------------------------------------*/

export type DependencyGraph = {
  [identifier: string]: Dependency<any>;
};

export type Dependency<TContent> = {
  // URI used here since it could be a url
  uri: string;

  content: TContent;
};

/*------------------------------------------
 * GETTERS
 *-----------------------------------------*/

export const getDependents = memoize((uri: string, graph: DependencyGraph) => {
  const dependents = [];

  for (const depUri in graph) {
    if (depUri === uri) {
      continue;
    }

    const dep = graph[depUri];
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

export const isPaperclipUri = (uri: string) => {
  return /\.pc$/.test(uri);
};

const createDependencyFromFileCacheItem = memoize(
  ({ uri, content }: { uri: string; content: Buffer }): Dependency<any> => ({
    uri,
    content: migratePCModule(JSON.parse(content.toString("utf8")))
  })
);

export const addFileCacheItemToDependencyGraph = (
  item: { uri: string; content: Buffer },
  graph: DependencyGraph = {}
): DependencyGraph => {
  return {
    ...graph,
    [item.uri]: createDependencyFromFileCacheItem(item)
  };
};

/*------------------------------------------
 * SETTERS
 *-----------------------------------------*/
