import { BaseEditorBrowserCommand } from "./base";
import { SyntheticHTMLAnchorElement, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { hasURIProtocol } from "@tandem/common";
import Url = require("url");

export class OpenLinkInNewWindowCommand extends BaseEditorBrowserCommand {
  execute() {
    const link = this.editorStore.workspace.selection[0] as SyntheticHTMLAnchorElement;
    const href = link.getAttribute("href");
    let newLocation;

    const location = link.ownerDocument.defaultView.location;
    console.log(location);
    if (hasURIProtocol(href)) {
      newLocation = href;
    } else if (href.charAt(0) === "/") {
      newLocation = location.protocol + "//" + location.host + href;
    } else {
      newLocation = location.protocol + "//" + location.host + location.pathname + href;
    }

    const edit = (this.editorStore.workspace.browser.document.firstChild as SyntheticHTMLElement).createEdit();
    const remoteBrowser = link.ownerDocument.createElement("remote-browser");
    remoteBrowser.setAttribute("src", newLocation);
    
    edit.appendChild(remoteBrowser);

    this.editorStore.workspace.applyFileMutations(edit.mutations);
  }
}