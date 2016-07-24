import { loggable } from 'sf-core/decorators';
import IOService from 'sf-common/services/io';
import * as SocketIOClient from 'socket.io-client';
import { IApplication } from 'sf-base/application';
import { ApplicationServiceFragment } from 'sf-core/fragments';

@loggable()
export default class BackEndService extends IOService<IApplication> {

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

export const fragment = new ApplicationServiceFragment('back-end', BackEndService);
