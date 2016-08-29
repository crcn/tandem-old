import { Action } from "sf-core/actions";
import { CSSSelectorExpression } from "sf-html-extension/ast";

export const TEXT_EDIT_COMPLETE = "textEditComplete";
export class TextEditCompleteAction extends Action {
  constructor() {
    super(TEXT_EDIT_COMPLETE);
  }
}

export const SELECT_WITH_CSS_SELECTOR = "selectWithCSSSelector";
export class SelectWithCSSSelector extends Action {
  constructor(readonly selector: CSSSelectorExpression) {
    super(SELECT_WITH_CSS_SELECTOR);
  }
}