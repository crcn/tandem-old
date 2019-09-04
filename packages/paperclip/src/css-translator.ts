import { memoize, KeyValue, hashToKeyValuePair } from "tandem-common";
import {
  PCContentNode,
  PCStyleBlock,
  PCComponent,
  PCVariable,
  computePCStyleBlock,
  PCModule
} from "./dsl";
import {
  createSyntheticCSSStyleSheet,
  SyntheticCSSStyleRule,
  createSyntheticCSSStyleRule,
  stringifySyntheticCSSObject
} from "./synthetic-cssom";

export const translateModuleToCSSSyleSheet = (
  module: PCModule,
  componentRefMap: KeyValue<PCComponent>,
  varRefMap: KeyValue<PCVariable>,
  indent: number = 0
) => {
  return module.children
    .map(child =>
      generateSyntheticStyleSheet(
        child as PCContentNode,
        componentRefMap,
        varRefMap
      )
    )
    .map(obj => stringifySyntheticCSSObject(obj, indent))
    .join("");
};

export const generateSyntheticStyleSheet = memoize(
  (
    contentNode: PCContentNode,
    componentRefMap: KeyValue<PCComponent>,
    varRefMap: KeyValue<PCVariable>
  ) => {
    return createSyntheticCSSStyleSheet(
      generateSyntheticStyleRules(contentNode, componentRefMap, varRefMap)
    );
  }
);

export const generateSyntheticStyleRules = memoize(
  (
    node: PCContentNode,
    componentRefMap: KeyValue<PCComponent>,
    varRefMap: KeyValue<PCVariable>
  ): SyntheticCSSStyleRule[] => {
    const selectorText = `._${node.id}`;

    const rules = generateSyntheticRulesFromStyles(
      selectorText,
      node.styles,
      componentRefMap,
      varRefMap
    );

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
