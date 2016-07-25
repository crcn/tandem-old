
import { Logger } from 'sf-core/logger';
import { loggable, isPublic, document } from 'sf-core/decorators';
import * as SocketIOBus from 'mesh-socket-io-bus';

import { Service } from 'sf-core/services';
import { ParallelBus } from 'mesh';

import { IApplication } from 'sf-core/application';
import { BaseApplicationService } from 'sf-core/services';

@loggable()
export default class IOService<T extends IApplication> extends BaseApplicationService<T> {

  public logger:Logger;
  public _publicService:Service;
  public _remoteActors:Array<any>;

  load() {

    // this is the public service which handles all
    // incomming actions
    this._publicService = new Service();

    // scan the application for all public actions and add
    // then to the public service
    for (const actor of this.app.actors) {
      for (const actionType of ((actor as any).__publicProperties || [])) {
        this.logger.info(`exposing ${actor.constructor.name}.${actionType}`);
        this._publicService.addActor(actionType, actor);
      }
    }

    // remote actors which take actions from the server
    this._remoteActors = [];

    // add the remote actors to the application so that they
    // receive actions from other parts of the application
    this.app.actors.push(ParallelBus.create(this._remoteActors));
  }

  /**
   * returns the publicly accessible actors
   */

  @isPublic
  @document('returns the public action types')
  getPublicActionTypes() {
    return Object.keys(this._publicService);
  }

  /**
   */

  @isPublic
  @document('pings remote connections')
  ping() {
    return 'pong';
  }

  /**
   */

  @document('returns the number of remote connections')
  getRemoteConnectionCount() {
    return this._remoteActors.length;
  }

  /**
   */

  addConnection = async (connection) => {
    this.logger.info('client connected');

    var remoteService = new Service();

    // from here on, all global actions will touch on this remote service object.
    // If the action is registered to the service, that action will be executed
    // against the remote client.
    this._remoteActors.push(remoteService);

    // setup the bus which will facilitate in all
    // transactions between the remote service
    var remoteBus = SocketIOBus.create({
      connection: connection
    }, this._publicService);

    // fetch the remote action types, and set them to the remote service
    // so that we limit the number of outbound actions
    for (const remoteActionType of await remoteBus.execute({ type: 'getPublicActionTypes' }).readAll()) {
      this.logger.verbose('adding remote action "%s"', remoteActionType);
      remoteService.addActor(remoteActionType, new ParallelBus([
        remoteBus
      ]));
    }

    connection.once('disconnect', () => {
      this.logger.info('client disconnected');

      this._remoteActors.splice(
        this._remoteActors.indexOf(remoteService),
        1
      );
    });
  }
}