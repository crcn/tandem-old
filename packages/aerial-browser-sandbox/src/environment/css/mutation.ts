import { Mutation } from "source-mutation";
import { SEnvCSSObjectInterface } from "./base";
import { CSS_INSERT_CSS_RULE_TEXT } from "./constants";

export type InsertCSSRuleText<T> = {
  cssText: string;
  childIndex: number;
} & Mutation<T>;

export const insertCSSRuleText = (target: SEnvCSSObjectInterface, childIndex: number, cssText: string): InsertCSSRuleText<SEnvCSSObjectInterface> => ({
  type: CSS_INSERT_CSS_RULE_TEXT,
  target,
  childIndex,
  cssText,
});
