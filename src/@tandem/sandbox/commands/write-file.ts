import { inject, BaseCommand } from "@tandem/common";
import { URIProtocolProvider } from "../uri";
import { WriteFileRequest } from "../messages";

export class WriteFileCommand extends BaseCommand { 
  execute({ uri, content }: WriteFileRequest) {
    const protocol = URIProtocolProvider.lookup(uri, this.kernel);
    return protocol.write(uri, content);
  }
}