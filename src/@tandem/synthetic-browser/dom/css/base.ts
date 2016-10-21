import { CSSExpression } from "./ast";
import { Bundle } from "@tandem/sandbox";

export class SyntheticCSSObject<T extends CSSExpression> {

  public $expression: T;
  public $bundle: Bundle;

  get expression() {
    return this.$expression;
  }
  get bundle() {
    return this.$bundle;
  }
}