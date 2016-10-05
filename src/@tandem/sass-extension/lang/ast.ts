import { CSSRootExpression, CSSATRuleExpression } from "@tandem/html-extension";

export class SassRootExpression extends CSSRootExpression {

}

export class SassImportExpression extends CSSATRuleExpression {
  toString() {
    return ["@", this.name, " ", this.params].join("");
  }
}