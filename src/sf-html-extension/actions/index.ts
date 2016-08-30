import { Action } from "sf-core/actions";
import { PasteAction } from "sf-front-end/actions";
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

export const PASTE_HTML_ENTITY = "pasteHTMLEntity";
export class PasteHTMLEntity extends Action {
  constructor(readonly item: DataTransferItem) {
    super(PASTE_HTML_ENTITY);
  }
}