import loggable from 'saffron-common/lib/logger/mixins/loggable';
import IOService from 'saffron-common/lib/services/io';
import * as SocketIOClient from 'socket.io-client';

import { FactoryFragment } from 'saffron-common/lib/fragments/index';

@loggable
export default class BackEndService extends IOService {

  private _client:SocketIOClient.Socket;
  public config:any;

  /**
   * initializes the back-end actor
   */

  async load() {
    await super.load();
    
    this.logger.info('starting socket.io client on port %d', this.config.socketio.port);
    this._client = SocketIOClient(`//${window.location.hostname}:${this.config.socketio.port}`);
    await this.addConnection(this._client);
  }
}

// TODO - ApplicationActorDependency.create({ id: })
export const fragment = new FactoryFragment({
  ns      : 'application/services/back-end',
  factory : BackEndService
});
