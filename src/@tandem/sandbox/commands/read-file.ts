import { inject, BaseCommand } from "@tandem/common";
import { URIProtocolProvider, IURIProtocolReadResult } from "../uri";
import { ReadFileRequest } from "../messages";

export class ReadFileCommand extends BaseCommand { 
  execute({ uri }: ReadFileRequest) {
    const protocol = URIProtocolProvider.lookup(uri, this.kernel);
    return protocol.read(uri);
  }
}