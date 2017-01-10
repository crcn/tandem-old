import * as React from "react";
import { AlertMessage } from "@tandem/editor/browser/messages";
import { GetTunnelUrlRequest } from "@tandem/editor/common";
import { ShowPromptRequest } from "@tandem/editor/browser/messages";
import { ShareWorkspacePromptComponent } from "../components";
import { BaseCollaborateExtensionBrowserCommand } from "./base";
import { StartWorkspaceTunnelRequest } from "../../common";


export class ShareWorkspaceCommand extends BaseCollaborateExtensionBrowserCommand {
  async execute() {
    // TODO - open tunnel
    const result = await StartWorkspaceTunnelRequest.dispatch(this.bus);

    const { clipboard } = require("electron");
    clipboard.writeText(result.url + location.hash);
    
    alert("A share link has been copied to your clipboard.");

    
    // this.bus.dispatch(new  ShowPromptRequest(ShowPromptRequest.PROMPT, (props) => {
    //   return <ShareWorkspacePromptComponent {...props} />
    // }, true));
  }
}