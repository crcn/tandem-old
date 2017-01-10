import { CollaborateRootStore } from "./stores";
import { CommandFactoryProvider } from "@tandem/common";
import { IOClientDisconnectedMessage } from "@tandem/editor/common";
import { RootCollaboratorStoreProvider } from "./providers";
import { SetMousePositionRequest, SetDisplayNameRequest } from "./messages";
import { SetMousePositionCommand, RemoveCollaboratorCommand } from "./commands";

export const createCommonCollaboratorProviders = () => {
  return [
    new RootCollaboratorStoreProvider(CollaborateRootStore),
    new CommandFactoryProvider(SetMousePositionRequest.SET_MOUSE_POSITION, SetMousePositionCommand),
    new CommandFactoryProvider(IOClientDisconnectedMessage.IO_CLIENT_DISCONNECTED, RemoveCollaboratorCommand),
  ]
}

export * from "./messages";
export * from "./stores";
export * from "./providers";