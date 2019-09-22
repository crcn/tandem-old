import {
  memoize,
  reuser,
  EMPTY_OBJECT,
  KeyValue,
  Bounds,
  appendChildNode
} from "tandem-common";
import {
  PCModule,
  getComponentGraphRefMap,
  PCSourceTagNames,
  getVariableRefMap,
  PCVisibleNode,
  PCVisibleNodeMetadataKey,
  getQueryRefMap,
  getAllVariableRefMap,
  PCNode
} from "./dsl";
import {
  compileContentNodeAsVanilla,
  VanillaPCRenderers,
  WindowInfo,
  VanillaPCRenderer
} from "./vanilla-compiler";
import { DependencyGraph } from "./graph";
import {
  createSytheticDocument,
  SyntheticDocument,
  SyntheticContentNode
} from "./synthetic-dom";
import { compileContentNodeToVanillaRenderer } from "./vanilla-compiler2";
import { generateSyntheticStyleSheet } from "./css-translator";
import { SyntheticCSSStyleSheet } from "./synthetic-cssom";

const reuseNodeGraphMap = reuser(500, (value: KeyValue<any>) =>
  Object.keys(value).join(",")
);

const reuseConentNode = reuser(500, (node: SyntheticContentNode) => node.id);

export const evaluateDependencyGraph = (
  graph: DependencyGraph,
  rootDirectory: string,
  variants: KeyValue<KeyValue<boolean>>,
  uriWhitelist?: string[]
): KeyValue<SyntheticDocument> => {
  const documents = {};
  const renderers = compileDependencyGraph(graph, rootDirectory);
  for (const uri in graph) {
    if (uriWhitelist && uriWhitelist.indexOf(uri) === -1) {
      continue;
    }
    const { content: module } = graph[uri];
    documents[uri] = evaluateModule(
      module,
      graph,
      variants,
      reuseNodeGraphMap(filterAssocRenderers(module, graph, renderers))
    );
  }

  return documents;
};

const evaluateModule = (
  module: PCModule,
  graph: DependencyGraph,
  variants: KeyValue<KeyValue<boolean>>,
  usedRenderers: VanillaPCRenderers
) => {
  return createSytheticDocument(
    module.id,
    module.children
      .filter(
        child =>
          child.name !== PCSourceTagNames.VARIABLE &&
          child.name !== PCSourceTagNames.QUERY
      )
      .map(child => {
        const contentNode = evaluateContentNode(
          child,
          variants[child.id] || EMPTY_OBJECT,
          usedRenderers
        );
        return reuseConentNode({
          ...contentNode,
          sheet: generateSyntheticStyleSheet(
            child,
            getComponentGraphRefMap(child, graph),
            getAllVariableRefMap(graph)
          )
        });
      })
  );
};

const evaluateContentNode = memoize(
  (
    contentNode: PCNode,
    variant: KeyValue<boolean>,
    renderers: VanillaPCRenderers
  ) => {
    return renderers[`_${contentNode.id}`](
      contentNode.id,
      null,
      EMPTY_OBJECT,
      "",
      variant,
      EMPTY_OBJECT,
      getWindowInfo(contentNode as PCVisibleNode),
      renderers,
      true
    );
  }
);

const getWindowInfo = (contentNode: PCVisibleNode): WindowInfo => {
  const bounds: Bounds = contentNode.metadata[PCVisibleNodeMetadataKey.BOUNDS];
  return {
    width: Math.round(bounds.right - bounds.left),
    height: Math.round(bounds.bottom - bounds.top)
  };
};

const filterAssocRenderers = (
  module: PCModule,
  graph: DependencyGraph,
  allRenderers: VanillaPCRenderers
) => {
  const assocRenderers: VanillaPCRenderers = {};
  const refMap = getComponentGraphRefMap(module, graph);
  for (const id in refMap) {
    assocRenderers[`_${id}`] = allRenderers[`_${id}`];
  }

  for (const child of module.children) {
    assocRenderers[`_${child.id}`] = allRenderers[`_${child.id}`];
  }
  return assocRenderers;
};

type CompiledInfo = {
  sheets: SyntheticCSSStyleSheet[];
  renderers: VanillaPCRenderers;
};

const compileDependencyGraph = memoize(
  (graph: DependencyGraph, rootDirectory: string) => {
    const renderers = {};
    for (const uri in graph) {
      const { content: module } = graph[uri];
      for (const contentNode of module.children) {
        renderers[`_${contentNode.id}`] = compileContentNodeToVanillaRenderer(
          contentNode,
          reuseNodeGraphMap(getComponentGraphRefMap(contentNode, graph)),
          reuseNodeGraphMap(getVariableRefMap(contentNode, graph)),
          reuseNodeGraphMap(getQueryRefMap(contentNode, graph)),
          uri,
          rootDirectory
        );
      }
    }
    return renderers;
  }
);
