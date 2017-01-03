import { ShareButtonComponent } from "./components";
import { ShareWorkspaceRequest } from "../common";
import { ShareWorkspaceCommand } from "./commands";
import { CommandFactoryProvider } from "@tandem/common";
import { HeaderComponentFactoryProvider } from "@tandem/editor/browser";

export const createCollaborateExtensionBrowserProviders = () => {
  return [
    new HeaderComponentFactoryProvider("shareButton", ShareButtonComponent),
    new CommandFactoryProvider(ShareWorkspaceRequest.SHARE_WORKSPACE, ShareWorkspaceCommand)
  ]
}