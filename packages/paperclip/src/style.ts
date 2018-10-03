import { memoize, KeyValue } from "tandem-common";
import { defaults } from "lodash";
import {
  InspectorNode,
  getInspectorNodeOverrides,
  getInspectorNodeByAssocId
} from "./inspector";
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

export type ComputeStyleOptions = {
  inheritedStyles?: boolean;
  overrides?: boolean;
  parentStyles?: boolean;
};

const DEFAULT_COMPUTE_STYLE_OPTIONS: ComputeStyleOptions = {
  inheritedStyles: true,
  overrides: true,
  parentStyles: true
};

export const computeStyleInfo = memoize(
  (
    inspectorNodes: InspectorNode[],
    rootInspectorNode: InspectorNode,
    variant: PCVariant,
    graph: DependencyGraph,
    options: ComputeStyleOptions = DEFAULT_COMPUTE_STYLE_OPTIONS
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

      if (options.parentStyles !== false) {
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
      }

      Object.assign(style, sourceNode.style);

      if (options.inheritedStyles !== false && sourceNode.inheritStyle) {
        for (const styleMixinId in sourceNode.inheritStyle) {
          const styleMixinInspectorNode = getInspectorNodeByAssocId(
            styleMixinId,
            rootInspectorNode
          );
          if (!styleMixinInspectorNode) {
            continue;
          }

          defaults(
            style,
            computeStyleInfo(
              toArray(styleMixinInspectorNode),
              rootInspectorNode,
              null,
              graph
            ).style
          );
        }
      }

      if (options.overrides !== false) {
        const overrides = getInspectorNodeOverrides(
          inspectorNode,
          rootInspectorNode,
          variant,
          graph
        );

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
    }

    return {
      sourceNodes,
      styleOverridesMap,
      style
    };
  }
);

const toArray = memoize(<TValue>(value: TValue) => [value]);
