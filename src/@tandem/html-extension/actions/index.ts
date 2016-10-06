import { Action } from "@tandem/common/actions";
import { PasteAction } from "@tandem/editor/actions";
import { CSSRuleExpression } from "@tandem/html-extension/lang";
import { IMarkupElementAttributeEntity } from "@tandem/html-extension/lang";

export const TEXT_EDIT_COMPLETE = "textEditComplete";
export class TextEditCompleteAction extends Action {
  constructor() {
    super(TEXT_EDIT_COMPLETE);
  }
}

export const SELECT_WITH_CSS_SELECTOR = "selectWithCSSSelector";
export class SelectWithCSSSelectorAction extends Action {
  constructor(readonly rule: CSSRuleExpression) {
    super(SELECT_WITH_CSS_SELECTOR);
  }
}
export class PasteHTMLEntityAction extends Action {
  static readonly PASTE_HTML_ENTITY = "pasteHTMLEntity";
  constructor(readonly item: DataTransferItem) {
    super(PasteHTMLEntityAction.PASTE_HTML_ENTITY);
  }
}
