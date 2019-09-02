import { PCStyleBlock } from "./dsl";
import {
  KeyValue,
  generateUID,
  keyValuePairToHash,
  memoize,
  KeyValuePair
} from "tandem-common";

export enum SyntheticCSSObjectType {
  STYLE_SHEET = "STYLE_SHEET",
  STYLE_RULE = "STYLE_RULE"
}

export type BaseSyntheticCSSObject<TType extends SyntheticCSSObjectType> = {
  type: TType;
  id: string;
};

export type SyntheticCSSStyleSheet = {
  rules: SyntheticCSSRule[];
} & BaseSyntheticCSSObject<SyntheticCSSObjectType.STYLE_SHEET>;

export type SyntheticCSSStyleRule = {
  source: PCStyleBlock;
  selectorText: string;
  style: KeyValuePair<string>[];
} & BaseSyntheticCSSObject<SyntheticCSSObjectType.STYLE_RULE>;

export type SyntheticCSSRule = SyntheticCSSStyleRule;
export type SyntheticCSSObject = SyntheticCSSStyleRule | SyntheticCSSStyleSheet;

export const createSyntheticCSSStyleSheet = (
  rules: SyntheticCSSRule[]
): SyntheticCSSStyleSheet => ({
  id: generateUID(),
  type: SyntheticCSSObjectType.STYLE_SHEET,
  rules
});

export const createSyntheticCSSStyleRule = (
  selectorText: string,
  properties: KeyValuePair<string>[],
  source: PCStyleBlock
): SyntheticCSSStyleRule => ({
  id: generateUID(),
  type: SyntheticCSSObjectType.STYLE_RULE,
  source,
  selectorText,
  style: properties
});

export const stringifySyntheticCSSObject = memoize(
  (object: SyntheticCSSObject) => {
    let buffer = "";
    switch (object.type) {
      case SyntheticCSSObjectType.STYLE_SHEET: {
        buffer += object.rules
          .map(rule => stringifySyntheticCSSObject(rule))
          .join("\n\n");
        break;
      }
      case SyntheticCSSObjectType.STYLE_RULE: {
        buffer += `${object.selectorText} {\n`;
        for (const { key, value } of object.style) {
          buffer += `  ${key}: ${value};\n`;
        }
        buffer += "}";
        break;
      }
    }
    return buffer;
  }
);