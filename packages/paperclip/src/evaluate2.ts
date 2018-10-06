import {
  memoize,
  reuser,
  EMPTY_OBJECT,
  KeyValue,
  shallowEquals
} from "tandem-common";
import {
  PCModule,
  getComponentGraphRefMap,
  PCVisibleNode,
  PCComponent,
  PCNode,
  PCSourceTagNames,
  getStyleVariableRefMap
} from "./dsl";
import {
  compileContentNodeAsVanilla,
  VanillaPCRenderers,
  VanillaPCRenderer
} from "./vanilla-compiler";
import { DependencyGraph } from "./graph";
import { createSytheticDocument, SyntheticDocument } from "./synthetic";

const reuseNodeGraphMap = reuser(
  500,
  (value: KeyValue<any>) => Object.keys(value).join(","),
  shallowEquals
);

export type EvalInfo = {
  graph: DependencyGraph;
  variants: KeyValue<KeyValue<boolean>>;
};

export const evaluateDependencyGraph = memoize(
  ({ graph, variants }): KeyValue<SyntheticDocument> => {
    const documents = {};
    const renderers = compileDependencyGraph(graph);
    for (const uri in graph) {
      const { content: module } = graph[uri];
      documents[uri] = evaluateModule(
        module,
        variants,
        reuseNodeGraphMap(filterAssocRenderers(module, graph, renderers))
      );
    }

    return documents;
  }
);

const evaluateModule = memoize(
  (
    module: PCModule,
    variants: KeyValue<KeyValue<boolean>>,
    usedRenderers: VanillaPCRenderers
  ) => {
    return createSytheticDocument(
      module.id,
      module.children
        .filter(child => child.name !== PCSourceTagNames.VARIABLE)
        .map(child => {
          return usedRenderers[`_${child.id}`](
            child.id,
            null,
            EMPTY_OBJECT,
            EMPTY_OBJECT,
            variants[child.id] || EMPTY_OBJECT,
            EMPTY_OBJECT,
            usedRenderers
          );
        })
    );
  }
);

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

const compileDependencyGraph = (graph: DependencyGraph) => {
  const renderers = {};
  for (const uri in graph) {
    const { content: module } = graph[uri];
    for (const contentNode of module.children) {
      renderers[`_${contentNode.id}`] = compileContentNodeAsVanilla(
        contentNode,
        reuseNodeGraphMap(getComponentGraphRefMap(contentNode, graph)),
        reuseNodeGraphMap(getStyleVariableRefMap(contentNode, graph)),
        uri
      );
    }
  }

  return renderers;
};
