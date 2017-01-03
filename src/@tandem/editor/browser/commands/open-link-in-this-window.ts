import { BaseEditorBrowserCommand } from "./base";
import { SyntheticHTMLAnchorElement, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { hasURIProtocol } from "@tandem/common";
import Url = require("url");
import { resolveHTTPUrl } from "./utils";

export class OpenLinkInThisWindowCommand extends BaseEditorBrowserCommand {
  execute() {
    const link = this.editorStore.workspace.selection[0] as SyntheticHTMLAnchorElement;
    const href = link.getAttribute("href");
    let newLocation = resolveHTTPUrl(href, link);

    const remoteBrowser = link.ownerDocument.$ownerNode as SyntheticHTMLElement;
    const edit = remoteBrowser.createEdit();
    edit.setAttribute("src", newLocation);
    remoteBrowser.setAttribute("src", newLocation);

    this.editorStore.workspace.applyFileMutations(edit.mutations);
  }
}