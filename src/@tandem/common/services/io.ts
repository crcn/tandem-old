// DEPRECATEd

import * as sift from "sift";
import { Logger } from "@tandem/common/logger";
import { Service } from "@tandem/common/services";
import { IApplication } from "@tandem/common/application";
import { Injector } from "@tandem/common/ioc";
import * as SocketIOBus from "mesh-socket-io-bus";
import { loggable, document } from "@tandem/common/decorators";
import { serialize, deserialize } from "@tandem/common/serialize";
import { ParallelBus, AcceptBus } from "mesh";
import { BaseApplicationService } from "@tandem/common/services";
import { LoadAction, InitializeAction, PropertyChangeAction, isPublicAction } from "@tandem/common/actions";

@loggable()
export class IOService<T extends IApplication> extends BaseApplicationService<T> {

  public logger: Logger;
  public _remoteActors: Array<any>;

  [LoadAction.LOAD]() {

    // remote actors which take actions from the server
    this._remoteActors = [];

    // // add the remote actors to the application so that they
    // // receive actions from other parts of the application
    // this.app.bus.register(
    //   new AcceptBus(
    //     sift({ remote: { $ne: true }, type: {$nin: [LoadAction.LOAD, InitializeAction.INITIALIZE, LogAction.LOG, PropertyChangeAction.PROPERTY_CHANGE] }}),
    //     ParallelBus.create(this._remoteActors),
    //     null
    //   )
    // );
  }

  /**
   */

  @document("pings remote connections")
  ping() {
    return "pong";
  }

  /**
   */

  addConnection = async (connection) => {
    this.logger.info("client connected");

    // setup the bus which wil facilitate in all
    // transactions between the remote service
    const remoteBus = new SocketIOBus({
      connection: connection
    }, {
      execute: (action) => {
        return this.bus.execute(Object.assign(action, { remote: true }));
      }
    }, { serialize: serialize, deserialize: deserialize });

    this._remoteActors.push({
      execute(action) {
        let data;
        if (!isPublicAction(action)) return;
        return remoteBus.execute(action);
      }
    });


    connection.once("disconnect", () => {
      this.logger.info("client disconnected");

      this._remoteActors.splice(
        this._remoteActors.indexOf(remoteBus),
        1
      );
    });
  }

  static create<T extends IApplication>(dependencies: Injector): IOService<T> {
    return dependencies.inject(new IOService<T>());
  }
}