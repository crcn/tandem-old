import * as React from "react";
import { AlertMessage } from "@tandem/editor/browser/messages";
import { ShowPromptRequest } from "@tandem/editor/browser/messages";
import { ShareWorkspacePromptComponent } from "../components";
import { BaseCollaborateExtensionCommand } from "./base";

export class ShareWorkspaceCommand extends BaseCollaborateExtensionCommand {
  execute() {
    // TODO - open tunnel
    alert("A share link has been copied to your clipboard.");
    // this.bus.dispatch(new  ShowPromptRequest(ShowPromptRequest.PROMPT, (props) => {
    //   return <ShareWorkspacePromptComponent {...props} />
    // }, true));
  }
}