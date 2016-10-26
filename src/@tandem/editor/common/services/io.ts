import * as sift from "sift";
import { Service } from "@tandem/common/services";
import * as SocketIOBus from "mesh-socket-io-bus";
import { serialize, deserialize } from "@tandem/common/serialize";
import { ParallelBus, AcceptBus } from "mesh";
import {
  Action,
  LogAction,
  LoadAction,
  isPublicAction,
  InitializeAction,
  PropertyChangeAction,
} from "@tandem/common";
import { CoreApplicationService } from "@tandem/core";

export class IOService<T> extends CoreApplicationService<T> {

  public _remoteActors: Array<any>;

  [LoadAction.LOAD]() {

    // remote actors which take actions from the server
    this._remoteActors = [];

    // add the remote actors to the application so that they
    // receive actions from other parts of the application


    this.bus.register(
      new AcceptBus(
        ((action: Action) => isPublicAction(action)),
        ParallelBus.create(this._remoteActors),
        null
      )
    );
  }

  /**
   */

  ping() {
    return "pong";
  }

  /**
   */

  addConnection = async (connection) => {
    console.info("client connected");

    // setup the bus which wil facilitate in all
    // transactions between the remote service
    const remoteBus = new SocketIOBus({ connection }, {
      execute: (action) => {
        return this.bus.execute(Object.assign(action, { remote: true }));
      }
    }, { serialize, deserialize });

    this._remoteActors.push({
      execute(action) {
        let data;
        if (!isPublicAction(action)) return;
        return remoteBus.execute(action);
      }
    });


    connection.once("disconnect", () => {
      console.info("client disconnected");

      this._remoteActors.splice(
        this._remoteActors.indexOf(remoteBus),
        1
      );
    });
  }
}