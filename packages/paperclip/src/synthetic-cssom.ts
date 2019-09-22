import { PCStyleBlock, PCVisibleNode, PCNode } from "./dsl";
import { generateUID, memoize, KeyValuePair } from "tandem-common";

export enum SyntheticCSSObjectType {
  STYLE_SHEET = "STYLE_SHEET",
  STYLE_RULE = "STYLE_RULE"
}

export type BaseSyntheticCSSObject<TType extends SyntheticCSSObjectType> = {
  type: TType;
  id: string;
};

export type SyntheticCSSStyleSheet = {
  sourceNodeId: string;
  rules: SyntheticCSSRule[];
} & BaseSyntheticCSSObject<SyntheticCSSObjectType.STYLE_SHEET>;

export type SyntheticCSSStyleRule = {
  sourceNodeId: string;
  selectorText: string;
  style: KeyValuePair<string>[];
} & BaseSyntheticCSSObject<SyntheticCSSObjectType.STYLE_RULE>;

export type SyntheticCSSRule = SyntheticCSSStyleRule;
export type SyntheticCSSObject = SyntheticCSSStyleRule | SyntheticCSSStyleSheet;

export const createSyntheticCSSStyleSheet = (
  rules: SyntheticCSSRule[],
  source: PCNode
): SyntheticCSSStyleSheet => ({
  sourceNodeId: source.id,
  id: `synthetic-css-${source.id}`,
  type: SyntheticCSSObjectType.STYLE_SHEET,
  rules
});

export const createSyntheticCSSStyleRule = (
  selectorText: string,
  properties: KeyValuePair<string>[],
  source: PCStyleBlock
): SyntheticCSSStyleRule => ({
  id: `synthetic-css-${source.id}`,
  type: SyntheticCSSObjectType.STYLE_RULE,
  sourceNodeId: source.id,
  selectorText,
  style: properties
});

export const stringifySyntheticCSSObject = memoize(
  (object: SyntheticCSSObject, depth: number = 0) => {
    let buffer = "";
    const indent = "  ".repeat(depth);
    switch (object.type) {
      case SyntheticCSSObjectType.STYLE_SHEET: {
        buffer += object.rules
          .map(rule => stringifySyntheticCSSObject(rule, depth))
          .join("");
        break;
      }
      case SyntheticCSSObjectType.STYLE_RULE: {
        buffer += `\n${indent}${object.selectorText} {\n`;
        for (const { key, value } of object.style) {
          buffer += `${indent}  ${key}: ${value};\n`;
        }
        buffer += indent + "}\n";
        break;
      }
    }
    return buffer;
  }
);
