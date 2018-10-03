import { memoize, KeyValue } from "tandem-common";
import { defaults } from "lodash";
import { InspectorNode, getInspectorNodeOverrides } from "./inspector";
import {
  PCComponent,
  PCVisibleNode,
  PCStyleOverride,
  getPCNode,
  PCNode,
  extendsComponent,
  PCVariant,
  ComputedStyleInfo,
  PCElement,
  isPCComponentInstance,
  PCOverridablePropertyName
} from "./dsl";
import { DependencyGraph } from "./graph";

export const computeStyleInfo = memoize(
  (
    inspectorNodes: InspectorNode[],
    rootInspectorNode: InspectorNode,
    variant: PCVariant,
    graph: DependencyGraph
  ): ComputedStyleInfo => {
    const style = {};
    const sourceNodes: (PCVisibleNode | PCComponent)[] = [];
    const styleOverridesMap: KeyValue<PCStyleOverride[]> = {};

    for (const inspectorNode of inspectorNodes) {
      const sourceNode = getPCNode(inspectorNode.assocSourceNodeId, graph) as
        | PCVisibleNode
        | PCComponent;
      sourceNodes.push(sourceNode);
      let current: PCNode = sourceNode;
      while (extendsComponent(current)) {
        const parent: PCElement = getPCNode(
          (current as PCComponent).is,
          graph
        ) as PCElement;
        if (isPCComponentInstance(parent)) {
          // defaults -- parents cannot disable
          defaults(style, parent.style);
        }
        current = parent;
      }

      const overrides = getInspectorNodeOverrides(
        inspectorNode,
        rootInspectorNode,
        variant,
        graph
      );

      Object.assign(style, sourceNode.style);
      for (const override of overrides) {
        if (override.propertyName === PCOverridablePropertyName.STYLE) {
          for (const key in override.value) {
            if (!styleOverridesMap[key]) {
              styleOverridesMap[key] = [];
            }
            styleOverridesMap[key].push(override);
            style[key] = override.value[key];
          }
        }
      }
    }

    return {
      sourceNodes,
      styleOverridesMap,
      style
    };
  }
);
