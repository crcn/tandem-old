import { memoize } from "tandem-common";
import { FileCache, FileCacheItem } from "fsbox";
import { PAPERCLIP_MIME_TYPE } from "./constants";

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
  ({ uri, content }: FileCacheItem): Dependency<any> => ({
    uri,
    content: JSON.parse(content.toString("utf8"))
  })
);

export const addFileCacheToDependencyGraph = (
  fsCache: FileCache,
  graph: DependencyGraph = {}
): DependencyGraph => {
  const newGraph = { ...graph };
  for (const uri in fsCache) {
    if (!graph[uri] && fsCache[uri].mimeType === PAPERCLIP_MIME_TYPE) {
      newGraph[uri] = createDependencyFromFileCacheItem(fsCache[uri]);
    }
  }

  return newGraph;
};

/*------------------------------------------
 * SETTERS
 *-----------------------------------------*/
