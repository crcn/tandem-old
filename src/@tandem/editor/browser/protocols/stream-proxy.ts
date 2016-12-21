import { IEditorCommonConfig } from "@tandem/editor/common";
import { URIProtocol, ReadFileRequest, WriteFileRequest, IURIProtocolReadResult } from "@tandem/sandbox";
import { inject, ApplicationConfigurationProvider, PrivateBusProvider, IBrokerBus } from "@tandem/common";

export class StreamProxyProtocol extends URIProtocol {

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  async fileExists(uri: string) {

    // cheap fix for now
    return !!(await this.read(uri));
  }

  async read(uri: string) {
    return await ReadFileRequest.dispatch(uri, this._bus);
  }

  async write(uri: string, content: string|Buffer) {
    return await WriteFileRequest.dispatch(uri, String(content), this._bus);
  }

  protected watch2(uri: string, callback: () => any) {
    this.logger.warn("Cannot currently watch remote uris");
    return {
      dispose() { 
      }
    }
  }
}