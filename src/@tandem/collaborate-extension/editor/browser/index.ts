import { CommandFactoryProvider, InitializeApplicationRequest } from "@tandem/common";
import { CollaborateHeaderComponent, CursorsStageToolComponent } from "./components";
import { ShareWorkspaceCommand, TrackMousePositionCommand, SyncSelectedCommand } from "./commands";
import { HeaderComponentFactoryProvider, StageToolComponentFactoryProvider, SelectRequest } from "@tandem/editor/browser";
import { ShareWorkspaceRequest, createCommonCollaboratorProviders, RootCollaboratorStoreProvider } from "../common";

export const createCollaborateExtensionBrowserProviders = () => {
  return [
    createCommonCollaboratorProviders(),
    new HeaderComponentFactoryProvider("shareButton", CollaborateHeaderComponent),
    new StageToolComponentFactoryProvider("cursors", null, CursorsStageToolComponent),
    new CommandFactoryProvider(ShareWorkspaceRequest.SHARE_WORKSPACE, ShareWorkspaceCommand),
    new CommandFactoryProvider(InitializeApplicationRequest.INITIALIZE, TrackMousePositionCommand),
    new CommandFactoryProvider(SelectRequest.SELECT, SyncSelectedCommand)
  ];
}