import { CoreEvent } from "@tandem/common/messages";
import { PasteRequest } from "@tandem/editor/browser";

export class PasteHTMLEntityAction extends CoreEvent {
  static readonly PASTE_HTML_ENTITY = "pasteHTMLEntity";
  constructor(readonly item: DataTransferItem) {
    super(PasteHTMLEntityAction.PASTE_HTML_ENTITY);
  }
}
