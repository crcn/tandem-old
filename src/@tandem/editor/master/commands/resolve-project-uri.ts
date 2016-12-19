import { MimeTypeProvider } from "@tandem/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";
import { BaseEditorMasterCommand } from "./base";
import { ResolveWorkspaceURIRequest, CreateTemporaryWorkspaceRequest } from "@tandem/editor/common/messages";

export class ResolveProjectFileURICommand extends  BaseEditorMasterCommand {
  execute({ uri }: ResolveWorkspaceURIRequest) {
    if (!uri || MimeTypeProvider.lookup(uri, this.kernel) !== TDPROJECT_MIME_TYPE) {
      return CreateTemporaryWorkspaceRequest.dispatch(uri, this.bus);
    } 
    return uri;
  }
}
