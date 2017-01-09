import { StartTunnelCommand } from "./commands";
import { CommandFactoryProvider } from "@tandem/common";
import { StartWorkspaceTunnelRequest } from "../common";

export const createCollaborateMasterExtensionProviders = () => {
  return [
    new CommandFactoryProvider(StartWorkspaceTunnelRequest.START_WORKSPACE_TUNNEL, StartTunnelCommand)
  ];
}