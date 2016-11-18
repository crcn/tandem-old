import * as SocketIOClient from "socket.io-client";
import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { IOService } from "@tandem/editor/common";
import {
  Logger,
  loggable,
  LoadRequest,
  ApplicationServiceProvider,
} from "@tandem/common";

@loggable()
export class ServerService extends IOService<IEditorBrowserConfig> {

  readonly logger: Logger;

  private _client: SocketIOClient.Socket;

  /**
   * initializes the back-end actor
   */

  async [LoadRequest.LOAD]() {
    if (!this.config.server || !this.config.server.port) {
      return;
    }

    const { server } = this.config;

    this.logger.debug(`starting socket.io client on  ${server.hostname}:${server.port}`);
    this._client = SocketIOClient(`${server.protocol || "http:"}//${server.hostname}:${server.port}`);
    await this.addConnection(this._client);
  }
}

