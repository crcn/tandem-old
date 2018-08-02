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
  ComponentRef,
  PCNode
} from "./dsl";
import {
  compileComponentRefMap,
  compileContentNodeAsVanilla
} from "./vanilla-compiler";
import { DependencyGraph } from "./graph";
import { createSytheticDocument } from "./synthetic";

const reuseComponentGraphMap = reuser(
  500,
  (value: KeyValue<PCComponent>) => Object.keys(value).join(","),
  shallowEquals
);

export const evaluatePCModule2 = memoize(
  (module: PCModule, graph: DependencyGraph) => {
    const document = createSytheticDocument(
      module.id,
      module.children.map(contentNode =>
        evaluateContentNode(
          contentNode,
          reuseComponentGraphMap(getUsedComponentMap(contentNode, graph))
        )
      )
    );
    return document;
  }
);

const evaluateContentNode = memoize(
  (contentNode: PCVisibleNode | PCComponent, refMap: KeyValue<PCComponent>) => {
    return compileContentNodeAsVanilla(contentNode)(
      EMPTY_OBJECT,
      compileComponentRefMap(refMap)
    );
  }
);

const getUsedComponentMap = (node: PCNode, graph: DependencyGraph) => {
  const map: KeyValue<PCComponent> = {};
  const refMap = getComponentGraphRefMap(node, graph);
  for (const id in refMap) {
    map[id] = refMap[id].component;
  }
  return map;
};
