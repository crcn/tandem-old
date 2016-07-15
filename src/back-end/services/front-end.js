
import IOService from 'common/services/io';
import createSocketIOServer from 'socket.io';
import { FactoryFragment } from 'common/fragments';

export default class FrontEndService extends IOService {

  async load() {
    await super.load();

    var port = this.config.socketio.port;
    this.logger.info(`listening on port ${port}`);
    this._server = createSocketIOServer();
    this._server.on('connection', this.addConnection);
    this._server.listen(port);
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/actors/front-end',
  factory: FrontEndService,
});
