import { Action } from "@tandem/common/actions";
import { PasteRequest } from "@tandem/editor/browser";

export class PasteHTMLEntityAction extends Action {
  static readonly PASTE_HTML_ENTITY = "pasteHTMLEntity";
  constructor(readonly item: DataTransferItem) {
    super(PasteHTMLEntityAction.PASTE_HTML_ENTITY);
  }
}
