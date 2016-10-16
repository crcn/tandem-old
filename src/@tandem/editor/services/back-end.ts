import * as SocketIOClient from "socket.io-client";
import {
  loggable,
  IOService,
  LoadAction,
  IApplication,
  ApplicationServiceDependency,
} from "@tandem/common";

@loggable()
export default class BackEndService extends IOService<IApplication> {

  private _client: SocketIOClient.Socket;

  /**
   * initializes the back-end actor
   */

  async [LoadAction.LOAD]() {
    await super[LoadAction.LOAD]();

    if (!this.app.config.backend || !this.app.config.backend.port) {
      return;
    }

    const { backend } = this.app.config;

    this.logger.info("starting socket.io client on  %s%d", backend.hostname, this.app.config.backend.port);
    this._client = SocketIOClient(`${backend.protocol || "http:"}//${backend.hostname}:${backend.port}`);
    await this.addConnection(this._client);
  }
}

export const backEndServiceDependency = new ApplicationServiceDependency("back-end", BackEndService);
