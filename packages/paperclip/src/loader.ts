/**
TODOS:

- better error messaging for files that are not found
*/

import {
  TreeNode,
  addTreeNodeIds,
  resolveFilePath,
  EMPTY_OBJECT,
  xmlToTreeNode,
  createTreeNode
} from "tandem-common";
import * as migratePCModule from "paperclip-migrator";
import {
  Dependency,
  DependencyGraph,
  PCModuleNode,
  createPCModule
} from "./dsl";
export type FileLoader = (uri: string) => string | Promise<string>;

export type LoadEntryOptions = {
  openFile: FileLoader;
  graph?: DependencyGraph;
};

export type LoadEntryResult = {
  entry: Dependency;
  graph: DependencyGraph;
};

export const loadEntry = async (
  entryFileUri: string,
  options: LoadEntryOptions
): Promise<LoadEntryResult> => {
  const graph: DependencyGraph = { ...(options.graph || EMPTY_OBJECT) };
  const queue: string[] = [entryFileUri];
  while (queue.length) {
    const currentUri = queue.shift();
    if (graph[currentUri]) {
      continue;
    }
    const module = await loadModule(currentUri, options);

    const absolutePaths = [];
    const importUris = {};

    for (const xmlns in module.attributes.xmlns || EMPTY_OBJECT) {
      const relativePath = module.attributes.xmlns[xmlns];
      const absolutePath = resolveFilePath(relativePath, currentUri);
      importUris[relativePath] = absolutePath;
      queue.push(absolutePath);
    }

    const dependency = createDependency(currentUri, module, importUris);
    graph[currentUri] = dependency;
  }

  return {
    entry: graph[entryFileUri],
    graph
  };
};

const createDependency = (
  uri: string,
  content: PCModuleNode,
  importUris
): Dependency => ({
  uri,
  content,
  originalContent: content,
  importUris
});

const parseNodeSource = (source: string) => {
  try {
    return addTreeNodeIds(JSON.parse(source));
  } catch (e) {
    return xmlToTreeNode(source);
  }
};

const loadModule = async (
  uri: string,
  options: LoadEntryOptions
): Promise<PCModuleNode> => {
  const content = await options.openFile(uri);

  // TODO - support other extensions in the future like images
  if (/xml$/.test(uri)) {
    // TODO - transform XML to JSON
    throw new Error(`XML is not supported yet`);
  } else if (/pc$/.test(uri)) {
    try {
      let source = parseNodeSource(content);
      return migratePCModule(source);
    } catch (e) {
      console.warn(e);
      return createPCModule();
    }
  } else if (!/json$/.test(uri)) {
    throw new Error(`Unsupported import ${uri}.`);
  } else {
    return JSON.parse(content);
  }
};
