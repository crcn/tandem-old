import * as SocketIOClient from "socket.io-client";
import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { IOService } from "@tandem/editor/common";
import {
  loggable,
  LoadAction,
  IApplication,
  ApplicationServiceDependency,
} from "@tandem/common";

export class ServerService extends IOService<IEditorBrowserConfig> {

  private _client: SocketIOClient.Socket;

  /**
   * initializes the back-end actor
   */

  async [LoadAction.LOAD]() {
    await super[LoadAction.LOAD]();

    if (!this.config.server || !this.config.server.port) {
      return;
    }

    const { server } = this.config;

    console.info("starting socket.io client on  %s:%d", server.hostname, server.port);
    this._client = SocketIOClient(`${server.protocol || "http:"}//${server.hostname}:${server.port}`);
    await this.addConnection(this._client);
  }
}

