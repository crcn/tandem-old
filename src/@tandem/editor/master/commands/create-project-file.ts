import * as path from "path";
import { BaseEditorMasterCommand } from "./base";
import { MimeTypeProvider, inject, removeURIProtocol, createDataUrl } from "@tandem/common";
import { TDPROJECT_MIME_TYPE, TD_PRIMARY_FILE_EXTENSION } from "@tandem/tdproject-extension/constants";
import { CreateTemporaryWorkspaceRequest } from "tandem-code/common";
import { FileCacheProvider, FileCache, URIProtocolProvider } from "@tandem/sandbox"; 

let i = 0;

export class CreateProjectFileCommand extends BaseEditorMasterCommand {
  
  async execute({ uri }: CreateTemporaryWorkspaceRequest) {

    // TODO - use HTTP instead here
    // temp name must share the same path as the file to ensure that all relative assets
    // are loaded in.

    let content;
    let type;

    if (uri && MimeTypeProvider.lookup(uri, this.kernel) === TDPROJECT_MIME_TYPE) {
      const result = await URIProtocolProvider.lookup(uri, this.kernel).read(uri);
      content = result.content;
      type    = result.type;
    } else {
      content = uri ? `<tandem>
        <remote-browser src="${uri}" />
      </tandem>` : `<tandem><remote-browser></remote-browser></tandem>`;
    }

    return createDataUrl(content, TDPROJECT_MIME_TYPE);
  }
} 