import { BaseEditorBrowserCommand } from "./base";
import { SyntheticHTMLAnchorElement, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { hasURIProtocol } from "@tandem/common";
import Url = require("url");
import { resolveHTTPUrl } from "./utils";

export class OpenLinkInNewWindowCommand extends BaseEditorBrowserCommand {
  execute() {
    const link = this.editorStore.workspace.selection[0] as SyntheticHTMLAnchorElement;
    const linkBrowser = link.ownerDocument.$ownerNode as SyntheticHTMLElement;
    const browserRect = linkBrowser.getBoundingClientRect();
    const href = link.getAttribute("href");
    let newLocation = resolveHTTPUrl(href, link);

    const edit = (this.editorStore.workspace.browser.document.firstChild as SyntheticHTMLElement).createEdit();
    const remoteBrowser = link.ownerDocument.createElement("remote-browser");
    remoteBrowser.setAttribute("src", newLocation);
    remoteBrowser.setAttribute("style", `left:${ Math.round(browserRect.left + 25)}px; top: ${Math.round(browserRect.top + 25)}px`);

    edit.appendChild(remoteBrowser);

    this.editorStore.workspace.applyFileMutations(edit.mutations);
  }
}