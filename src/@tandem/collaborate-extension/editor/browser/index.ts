import { ShareWorkspaceRequest } from "../common";
import { ShareWorkspaceCommand } from "./commands";
import { CommandFactoryProvider } from "@tandem/common";
import { ShareButtonComponent, CursorsStageToolComponent } from "./components";
import { HeaderComponentFactoryProvider, StageToolComponentFactoryProvider } from "@tandem/editor/browser";

export const createCollaborateExtensionBrowserProviders = () => {
  return [
    new HeaderComponentFactoryProvider("shareButton", ShareButtonComponent),
    new StageToolComponentFactoryProvider("cursors", null, CursorsStageToolComponent),
    new CommandFactoryProvider(ShareWorkspaceRequest.SHARE_WORKSPACE, ShareWorkspaceCommand)
  ]
}