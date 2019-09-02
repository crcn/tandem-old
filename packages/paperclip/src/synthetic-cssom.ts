import { PCStyleBlock } from "./dsl";
import { KeyValue } from "tandem-common";

export type SyntheticCSSStyleSheet = {
  id: string;
  rules: SyntheticCSSRules[];
};

export type SyntheticCSSStyleRule = {
  id: string;
  source: PCStyleBlock;
  selectorText: string;
  style: KeyValue<string>;
};

export type SyntheticCSSRules = SyntheticCSSStyleRule;
