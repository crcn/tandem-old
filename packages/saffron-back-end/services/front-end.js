
import IOService from 'saffron-common/services/io';
import createSocketIOServer from 'socket.io';
import { FactoryFragment } from 'saffron-common/fragments';

export default class FrontEndService extends IOService {

  async load() {
    await super.load();

    var port = this.config.socketio.port;
    this.logger.info(`listening on port ${port}`);
    this._server = createSocketIOServer();
    this._server.set('origins', '*domain.com*:*');
    this._server.on('connection', this.addConnection);
    this._server.listen(port);
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/services/front-end',
  factory: FrontEndService,
});
