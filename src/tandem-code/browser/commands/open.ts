import { OpenWorkspaceRequest } from "@tandem/editor/common";
import { BaseEditorBrowserCommand } from "@tandem/editor/browser/commands";
import { TDPROJECT_XMLNS } from "@tandem/tdproject-extension/constants";
import { RedirectRequest, createWorkspaceRedirectRequest } from "@tandem/editor/browser/messages";
import { } from "@tandem/common";
import { ResolveWorkspaceURIRequest } from "tandem-code/common";
import { remote } from "electron";
const { dialog } = remote;

export class OpenCommand extends BaseEditorBrowserCommand {
  execute() {
    dialog.showOpenDialog({

    }, async (fileNames: string[]) => {
      const uri = await ResolveWorkspaceURIRequest.dispatch(fileNames[0], this.bus);
      await this.bus.dispatch(createWorkspaceRedirectRequest(uri));
    });
  }
}