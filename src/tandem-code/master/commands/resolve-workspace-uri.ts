import { BaseStudioMasterCommand } from "./base";
import { MimeTypeProvider } from "@tandem/common";
import { ResolveWorkspaceURIRequest, CreateTemporaryWorkspaceRequest } from "tandem-code/common";
import { TDPROJECT_MIME_TYPE } from "@tandem/tdproject-extension/constants";

export class ResolveWorkspaceURICommand extends BaseStudioMasterCommand {
  execute({ uri }: ResolveWorkspaceURIRequest) {
    if (!uri || MimeTypeProvider.lookup(uri, this.kernel) !== TDPROJECT_MIME_TYPE) {
      return CreateTemporaryWorkspaceRequest.dispatch(uri, this.bus);
    } 

    return uri;
  }
}