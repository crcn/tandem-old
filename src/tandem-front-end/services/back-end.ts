import { LOAD } from "tandem-common/actions";
import { loggable } from "tandem-common/decorators";
import { IOService } from "tandem-common/services";
import { IApplication } from "tandem-common/application";
import * as SocketIOClient from "socket.io-client";
import { ApplicationServiceDependency } from "tandem-common/dependencies";

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
