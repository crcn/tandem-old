import {
  memoize,
  KeyValue,
  getParentTreeNode,
  EMPTY_OBJECT,
  keyValuePairToHash
} from "tandem-common";
import { defaults, pick } from "lodash";
import {
  InspectorNode,
  getInspectorNodeOverrides,
  getInspectorNodeBySourceNodeId,
  InspectorTreeNodeName
} from "./inspector";
import {
  PCComponent,
  PCVisibleNode,
  PCStylesOverride,
  getPCNode,
  PCNode,
  extendsComponent,
  PCVariant,
  PCElement,
  PCOverridableType,
  isPCComponentOrInstance,
  PCStyleMixin,
  getSortedStyleMixinIds,
  INHERITABLE_STYLE_NAMES,
  TEXT_STYLE_NAMES,
  isElementLikePCNode,
  PCTextStyleMixin,
  getVanillStyle,
  filterStyleMixins
} from "./dsl";

import { DependencyGraph } from "./graph";

export type ComputeStyleOptions = {
  styleMixins?: boolean;
  inheritedStyles?: boolean;
  overrides?: boolean;
  parentStyles?: boolean;
  self?: boolean;
};

const DEFAULT_COMPUTE_STYLE_OPTIONS: ComputeStyleOptions = {
  styleMixins: true,
  inheritedStyles: true,
  overrides: true,
  parentStyles: true,
  self: true
};

export type ComputedStyleInfo = {
  sourceNode: PCNode;
  styleOverridesMap: KeyValue<PCStylesOverride[]>;
  styleMixinMap: KeyValue<PCStyleMixin>;
  styleInheritanceMap: KeyValue<InspectorNode>;
  style: {
    [identifier: string]: string;
  };
};

// TODO - take single inspector node and use merging function instead of taking
// array here.
export const computeStyleInfo = memoize(
  (
    inspectorNode: InspectorNode,
    rootInspectorNode: InspectorNode,
    variant: PCVariant,
    graph: DependencyGraph,
    options: ComputeStyleOptions = DEFAULT_COMPUTE_STYLE_OPTIONS
  ): ComputedStyleInfo | null => {
    let style = {};
    const styleOverridesMap: KeyValue<PCStylesOverride[]> = {};
    let styleMixinMap: KeyValue<PCStyleMixin> = {};

    const sourceNode = getPCNode(inspectorNode.sourceNodeId, graph) as
      | PCVisibleNode
      | PCComponent;

    let current: PCNode = sourceNode;

    if (options.parentStyles !== false) {
      while (extendsComponent(current)) {
        const parent: PCElement = getPCNode(
          (current as PCComponent).is,
          graph
        ) as PCElement;
        if (isPCComponentOrInstance(parent)) {
          // defaults -- parents cannot disable
          defaults(style, getVanillStyle(parent.styles));
        }
        current = parent;
      }
    }

    if (options.self !== false && sourceNode.styles) {
      Object.assign(style, getVanillStyle(sourceNode.styles));
    }

    if (
      options.styleMixins !== false &&
      sourceNode.styles &&
      filterStyleMixins(sourceNode.styles).length
    ) {
      styleMixinMap = getStyleMixinMap(sourceNode as PCVisibleNode, graph);
      defaults(style, styleMixinMapToStyle(styleMixinMap));
    }

    if (options.overrides !== false) {
      const overrides = getInspectorNodeOverrides(
        inspectorNode,
        rootInspectorNode,
        variant,
        graph
      );

      for (const override of overrides) {
        if (override.type === PCOverridableType.STYLES) {
          for (const block of override.value) {
            // TODO - need to consider mixin ids & variants here
            for (const { key, value } of block.properties) {
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

    const styleInheritanceMap: KeyValue<InspectorNode> = {};

    if (options.inheritedStyles !== false) {
      let parent = getParentTreeNode(
        inspectorNode.id,
        rootInspectorNode
      ) as InspectorNode;
      while (parent) {
        if (parent.name === InspectorTreeNodeName.SOURCE_REP) {
          const parentSource = getPCNode(
            parent.sourceNodeId,
            graph
          ) as PCVisibleNode;
          if (isElementLikePCNode(parentSource)) {
            const inheritedStyle = pick(
              computeStyleInfo(parent, rootInspectorNode, variant, graph).style,
              INHERITABLE_STYLE_NAMES
            );

            for (const key in inheritedStyle) {
              if (!style[key]) {
                styleInheritanceMap[key] = parent;
                style[key] = inheritedStyle[key];
              }
            }
          }
        }
        parent = getParentTreeNode(
          parent.id,
          rootInspectorNode
        ) as InspectorNode;
      }
    }

    return {
      sourceNode,
      styleMixinMap,
      styleOverridesMap,
      styleInheritanceMap,
      style
    };
  }
);

const styleMixinMapToStyle = (map: KeyValue<PCStyleMixin>) => {
  let style = {};
  for (const key in map) {
    style[key] = getVanillStyle(map[key].styles)[key];
  }
  return style;
};

const getStyleMixinMap = (
  node: PCVisibleNode | PCStyleMixin,
  graph: DependencyGraph,
  includeSelf?: boolean
): KeyValue<PCStyleMixin> => {
  let map = {};
  if (includeSelf) {
    const vanillaStyle = getVanillStyle(node.styles);
    for (const key in vanillaStyle) {
      map[key] = node;
    }
  }
  if (filterStyleMixins(node.styles)) {
    const sortedStyleMixinIds = getSortedStyleMixinIds(node);
    for (const styleMixinId of sortedStyleMixinIds) {
      const styleMixin = getPCNode(styleMixinId, graph) as PCStyleMixin;

      // may have been deleted by user
      if (!styleMixin) {
        continue;
      }
      defaults(map, getStyleMixinMap(styleMixin, graph, true));
    }
  }
  return map;
};

export const filterTextStyles = (style: any) => {
  return pick(style, TEXT_STYLE_NAMES);
};

export const getTextStyles = (
  inspectorNode: InspectorNode,
  rootInspectorNode: InspectorNode,
  variant: PCVariant,
  graph: DependencyGraph
) =>
  filterTextStyles(
    computeStyleInfo(inspectorNode, rootInspectorNode, variant, graph, {
      styleMixins: false,
      inheritedStyles: false,
      overrides: true,
      parentStyles: false,
      self: true
    }).style
  );
export const hasTextStyles = (
  inspectorNode: InspectorNode,
  rootInspectorNode: InspectorNode,
  variant: PCVariant,
  graph: DependencyGraph
) =>
  Boolean(
    Object.keys(getTextStyles(inspectorNode, rootInspectorNode, variant, graph))
      .length
  );
