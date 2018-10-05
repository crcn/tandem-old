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
  PCElement,
  isPCComponentInstance,
  PCOverridablePropertyName,
  isPCComponentOrInstance,
  PCStyleMixin,
  getSortedStyleMixinIds
} from "./dsl";
import { DependencyGraph } from "./graph";

export type ComputeStyleOptions = {
  inheritedStyles?: boolean;
  overrides?: boolean;
  parentStyles?: boolean;
  self?: boolean;
};

const DEFAULT_COMPUTE_STYLE_OPTIONS: ComputeStyleOptions = {
  inheritedStyles: true,
  overrides: true,
  parentStyles: true,
  self: true
};

export type ComputedStyleInfo = {
  sourceNodes: PCNode[];
  styleOverridesMap: KeyValue<PCStyleOverride[]>;
  style: {
    [identifier: string]: string;
  };
};

// TODO - take single inspector node and use merging function instead of taking
// array here.
export const computeStyleInfo = memoize(
  (
    inspectorNodes: InspectorNode[],
    rootInspectorNode: InspectorNode,
    variant: PCVariant,
    graph: DependencyGraph,
    options: ComputeStyleOptions = DEFAULT_COMPUTE_STYLE_OPTIONS
  ): ComputedStyleInfo => {
    let style = {};
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
          if (isPCComponentOrInstance(parent)) {
            // defaults -- parents cannot disable
            defaults(style, parent.style);
          }
          current = parent;
        }
      }

      if (options.self !== false) {
        Object.assign(style, sourceNode.style);
      }

      if (options.inheritedStyles !== false && sourceNode.styleMixins) {
        style = computeMixinStyle(sourceNode as PCVisibleNode, graph, false);
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

const computeMixinStyle = (
  node: PCVisibleNode | PCStyleMixin,
  graph: DependencyGraph,
  includeSelf?: boolean
) => {
  let style = {};
  if (includeSelf) {
    Object.assign(style, node.style);
  }
  if (node.styleMixins) {
    const sortedStyleMixinIds = getSortedStyleMixinIds(node);
    for (const styleMixinId of sortedStyleMixinIds) {
      const styleMixin = getPCNode(styleMixinId, graph) as PCStyleMixin;

      // may have been deleted by user
      if (!styleMixin) {
        continue;
      }
      defaults(style, computeMixinStyle(styleMixin, graph, true));
    }
  }
  return style;
};

const toArray = memoize(<TValue>(value: TValue) => [value]);
