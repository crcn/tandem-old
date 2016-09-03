import { LOAD } from "sf-common/actions";
import { loggable } from "sf-common/decorators";
import { IOService } from "sf-common/services";
import { IApplication } from "sf-common/application";
import * as SocketIOClient from "socket.io-client";
import { ApplicationServiceDependency } from "sf-common/dependencies";

@loggable()
export default class BackEndService extends IOService<IApplication> {

  private _client: SocketIOClient.Socket;

  /**
   * initializes the back-end actor
   */

  async [LOAD]() {
    await super[LOAD]();

    if (!this.app.config.backend || !this.app.config.backend.port) {
      return;
    }

    this.logger.info("starting socket.io client on port %d", this.app.config.backend.port);
    this._client = SocketIOClient(`//${window.location.hostname}:${this.app.config.backend.port}`);
    await this.addConnection(this._client);
  }

}

export const dependency = new ApplicationServiceDependency("back-end", BackEndService);
