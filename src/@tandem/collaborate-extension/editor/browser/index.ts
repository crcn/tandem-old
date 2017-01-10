import { CollaborateHeaderComponent, CursorsStageToolComponent } from "./components";
import { ShareWorkspaceCommand, TrackMousePositionCommand } from "./commands";
import { CommandFactoryProvider, InitializeApplicationRequest } from "@tandem/common";
import { ShareWorkspaceRequest, createCommonCollaboratorProviders } from "../common";
import { HeaderComponentFactoryProvider, StageToolComponentFactoryProvider } from "@tandem/editor/browser";

export const createCollaborateExtensionBrowserProviders = () => {
  return [
    createCommonCollaboratorProviders(),
    new HeaderComponentFactoryProvider("shareButton", CollaborateHeaderComponent),
    new StageToolComponentFactoryProvider("cursors", null, CursorsStageToolComponent),
    new CommandFactoryProvider(ShareWorkspaceRequest.SHARE_WORKSPACE, ShareWorkspaceCommand),
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, TrackMousePositionCommand)
  ]
}