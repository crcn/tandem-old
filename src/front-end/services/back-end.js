import loggable from 'common/logger/mixins/loggable';
import IOService from 'common/services/io';
import createSocketIOClient from 'socket.io-client';

import { FactoryFragment } from 'common/fragments';

@loggable
export default class BackEndService extends IOService {

  /**
   * initializes the back-end actor
   */

  async load() {
    await super.load();
    await new Promise((resolve) => {
      this.logger.info('starting socket.io client on port %d', this.config.socketio.port);
      this._client = createSocketIOClient(`//${window.location.hostname}:${this.config.socketio.port}`);
      this.addConnection(this._client);
      this._client.on('connect', resolve);
    });
  }
}

// TODO - ApplicationActorDependency.create({ id: })
export const fragment = FactoryFragment.create({
  ns      : 'application/actors/back-end',
  factory : BackEndService,
});
