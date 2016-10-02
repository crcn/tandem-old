import { CSSRootExpression, CSSATRuleExpression } from "@tandem/html-extension";

export class SCSSRootExpression extends CSSRootExpression {

}

export class SCSSImportExpression extends CSSATRuleExpression {
  toString() {
    return ["@", this.name, " ", this.params].join("");
  }
}