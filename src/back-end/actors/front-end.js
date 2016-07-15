
import loggable from 'common/logger/mixins/loggable';
import isPublic from 'common/actors/decorators/public';
import SocketIOBus from 'mesh-socket-io-bus';
import createSocketIOServer from 'socket.io';
import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';
import { ParallelBus } from 'mesh';

@loggable
export default class FrontEndService extends Service {

  load() {
    this.publicService = Service.create({
      target: {},
    });

    for (const actor of this.app.actors) {
      for (const actionType of (actor.publicProperties || [])) {
        this.logger.info(`exposing ${actor.constructor.name}.${actionType}`);
        this.publicService.setActor(actionType, actor);
      }
    }

    // these are the remote actors which invoke actions against
    // the server
    this._remoteActors = [];

    this.remoteBus = ParallelBus.create(this._remoteActors);

    var port = this.config.socketio.port;
    this.logger.info(`listening on port ${port}`);
    this._server = createSocketIOServer();
    this._server.on('connection', this.onConnection);
    this._server.listen(port);
  }

  /**
   */

  @isPublic
  ping() {
    return 'pong';
  }

  /**
   */

  @isPublic
  getPublicActionTypes() {
    return Object.keys(this.publicService.target);
  }

  /**
   * called when a remote socket.io client connects
   * with the backend
   */

  onConnection = (connection) => {
    this.logger.info('client connected');

    var remoteBus = SocketIOBus.create({
      client: connection,
    }, this.publicService);

    connection.once('close', () => {
      this.logger.info('client disconnected');
      this._remoteActors.splice(
        this._remoteActors.indexOf(remoteBus),
        1
      );
    });
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/actors/front-end',
  factory: FrontEndService,
});
