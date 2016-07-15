import loggable from 'common/logger/mixins/loggable';
import SocketIOBus from 'mesh-socket-io-bus';
import createSocketIOClient from 'socket.io-client';

import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';

@loggable
export default class BackEndService extends Service {

  /**
   * initializes the back-end actor
   */

  async load() {
    return new Promise((resolve) => {
      this._didLoad = resolve;

      this.logger.info('starting socket.io client on port %d', this.config.socketio.port);
      this._client = createSocketIOClient(`//${window.location.hostname}:${this.config.socketio.port}`);
      this._client.on('connect', this._onConnection);

      this._remoteBus = SocketIOBus.create({
        client: this._client,
      });
    });
  }

  _onConnection = async () => {
    for (const publicActionType of await this._remoteBus.execute({ type: 'getPublicActionTypes' }).readAll()) {
      this.logger.info('setting remote action "%s"', publicActionType);
      this.setActor(publicActionType, this._remoteBus);
    }

    this._didLoad();
  }
}

// TODO - ApplicationActorDependency.create({ id: })
export const fragment = FactoryFragment.create({
  ns      : 'application/actors/back-end',
  factory : BackEndService,
});
