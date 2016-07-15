import { BaseService } from 'common/services';
import { FactoryFragment } from 'common/fragments';
import loggable from 'common/logger/mixins/loggable';
import createSocketIOClient from 'socket.io-client';


@loggable
export default class BackEndActor extends BaseService {

  load() {
    this.logger.info('starting socket.io client on port %d', this.config.socketio.port);
    this.client = createSocketIOClient(`//${window.location.hostname}:${this.config.socketio.port}`);
  }

  initialize(event) {
    this.logger.info('initializing');
  }
}

// TODO - ApplicationActorDependency.create({ id: })
export const fragment = FactoryFragment.create({
  ns: 'application/actors/back-end',
  factory: BackEndActor
})
