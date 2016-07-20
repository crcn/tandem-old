import loggable from 'saffron-common/src/decorators/loggable';
import IOService from 'saffron-common/src/services/io';
import * as SocketIOClient from 'socket.io-client';

import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';

@loggable
export default class BackEndService extends IOService {

  private _client:SocketIOClient.Socket;

  /**
   * initializes the back-end actor
   */

  async load() {
    await super.load();
    this.logger.info('starting socket.io client on port %d', this.app.config.socketio.port);
    this._client = SocketIOClient(`//${window.location.hostname}:${this.app.config.socketio.port}`);
    await this.addConnection(this._client);
  }
}

export const fragment = new ApplicationServiceFragment('application/services/back-end', BackEndService);
