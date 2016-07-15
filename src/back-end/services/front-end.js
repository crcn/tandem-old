import { FactoryFragment } from 'common/fragments';
import { BaseService } from 'common/services';
import { ParallelBus } from 'mesh';
import loggable from 'common/logger/mixins/loggable';
import createSocketIOServer from 'socket.io';
import RemoteBus from 'mesh-remote-bus';
import sift from 'sift';

@loggable
export default class FrontEndService extends BaseService {

  load(action) {

    // these are the actors which are accessible remotely
    this.publicActors = sift({ public: true }, this.app.actors);

    this.publicBus = ParallelBus.create(this.publicActors);

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
   * called when a remote socket.io client connects
   * with the backend
   */

  onConnection = (connection) => {
    this.logger.info('client connected');

    var remoteBus = RemoteBus.create({
      addListener: connection.on.bind(connection, 'message'),
      send: connection.emit.bind(connection, 'message')
    }, this.publicBus);

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
  factory: FrontEndService
});
