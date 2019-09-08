import { memoize, KeyValue, hashToKeyValuePair } from "tandem-common";
import {
  PCContentNode,
  PCStyleBlock,
  PCComponent,
  PCVariable,
  computePCStyleBlock,
  PCModule,
  isVisibleNode,
  PCNode,
  PCSourceTagNames,
  isComponentLike,
  PCOverride,
  PCOverridableType,
  getComponentGraphRefMap,
  getVariableRefMap,
  getAllVariableRefMap
} from "./dsl";
import {
  createSyntheticCSSStyleSheet,
  SyntheticCSSStyleRule,
  createSyntheticCSSStyleRule,
  stringifySyntheticCSSObject
} from "./synthetic-cssom";
import { DependencyGraph } from "./graph";

export const translateModuleToCSSSyleSheet = (
  module: PCModule,
  graph: DependencyGraph,
  indent: number = 0
) => {
  return module.children
    .map(child =>
      generateSyntheticStyleSheet(
        child,
        getComponentGraphRefMap(child, graph),

        // should be okay since variable refs probably
        // wouldn't be touched a whole lot.
        getAllVariableRefMap(graph)
      )
    )
    .map(obj => stringifySyntheticCSSObject(obj, indent))
    .join("");
};

export const translateContentNodeToStylesheet = memoize(() => {});

export const generateSyntheticStyleSheet = memoize(
  (
    contentNode: PCNode,
    componentRefMap: KeyValue<PCComponent>,
    varRefMap: KeyValue<PCVariable>
  ) => {
    const contentNodeRules = generateSyntheticStyleRules(
      contentNode,
      componentRefMap,
      varRefMap
    );
    const refComponentRules = Object.values(componentRefMap).reduce(
      (rules, component) => {
        rules.push(
          ...generateSyntheticStyleRules(component, componentRefMap, varRefMap)
        );
        return rules;
      },
      []
    );

    return createSyntheticCSSStyleSheet(
      [...contentNodeRules, ...refComponentRules],
      contentNode
    );
  }
);

export const generateSyntheticStyleRules = memoize(
  (
    node: PCNode,
    componentRefMap: KeyValue<PCComponent>,
    varRefMap: KeyValue<PCVariable>
  ): SyntheticCSSStyleRule[] => {
    const selectorText = `._${node.id}`;
    const rules: SyntheticCSSStyleRule[] = [];

    if (isVisibleNode(node) || node.name === PCSourceTagNames.COMPONENT) {
      rules.push(
        ...generateSyntheticRulesFromStyles(
          selectorText,
          node.styles,
          componentRefMap,
          varRefMap
        )
      );
    }

    if (isComponentLike(node)) {
      rules.push(
        ...generateSyntheticRulesFromOverrides(
          node.overrides,
          componentRefMap,
          varRefMap
        )
      );
    }

    for (const child of node.children) {
      rules.push(
        ...generateSyntheticStyleRules(
          child as PCNode,
          componentRefMap,
          varRefMap
        )
      );
    }

    return rules;
  }
);

const generateSyntheticRulesFromOverrides = memoize(
  (
    overrides: PCOverride[],
    componentRefMap: KeyValue<PCComponent>,
    varRefMap: KeyValue<PCVariable>
  ): SyntheticCSSStyleRule[] => {
    const rules = [];
    for (const override of overrides) {
      if (override.type === PCOverridableType.STYLES) {
        const prefixSelectorText = `._${override.id}`;
        rules.push(
          ...generateSyntheticRulesFromStyles(
            prefixSelectorText,
            override.value,
            componentRefMap,
            varRefMap
          )
        );
      }
    }

    return rules;
  }
);

const generateSyntheticRulesFromStyles = memoize(
  (
    prefixSelectorText: string,
    styles: PCStyleBlock[],
    componentRefMap: KeyValue<PCComponent>,
    varRefMap: KeyValue<PCVariable>
  ) => {
    const rules: SyntheticCSSStyleRule[] = [];
    for (const block of styles) {
      rules.push(
        generateSyntheticRuleFromStyles(
          prefixSelectorText,
          block,
          componentRefMap,
          varRefMap
        )
      );
    }

    return rules.filter(Boolean);
  }
);

const generateSyntheticRuleFromStyles = memoize(
  (
    prefixSelectorText: string,
    block: PCStyleBlock,
    componentRefMap: KeyValue<PCComponent>,
    varRefMap: KeyValue<PCVariable>
  ) => {
    let selectorText = prefixSelectorText;

    const properties = computePCStyleBlock(block, componentRefMap, varRefMap);
    if (Object.keys(properties).length === 0) {
      return null;
    }
    if (block.variantId) {
      selectorText = `._${block.variantId}${selectorText}, ._${
        block.variantId
      } ${selectorText}`;
    }
    return createSyntheticCSSStyleRule(
      selectorText,
      hashToKeyValuePair(properties),
      block
    );
  }
);
