import { URIProtocolProvider } from "@tandem/sandbox";
import { 
  GetProjectCommand,
  CreateNewProjectCommand, 
  ResolveProjectFileURICommand,
  CreateProjectFileCommand
} from "./commands";
import { CommandFactoryProvider, IProvider, ApplicationConfigurationProvider } from "@tandem/common";
import { 
  GetProjectRequest,
  CreateNewProjectRequest, 
  ResolveWorkspaceURIRequest,
  createCommonEditorProviders, 
  CreateTemporaryWorkspaceRequest,
} from "@tandem/editor/common";

export const createEditorMasterProviders = (config?: any) => {
  return [
    createCommonEditorProviders(config),
    new CommandFactoryProvider(ResolveWorkspaceURIRequest.RESOLVE_WORKSPACE_URI, ResolveProjectFileURICommand),
    new CommandFactoryProvider(CreateTemporaryWorkspaceRequest.CREATE_TEMPORARY_WORKSPACE, CreateProjectFileCommand),
    new CommandFactoryProvider(GetProjectRequest.GET_PROJECT, GetProjectCommand),
    new CommandFactoryProvider(CreateNewProjectRequest.CREATE_NEW_PROJECT, CreateNewProjectCommand),
  ];
}