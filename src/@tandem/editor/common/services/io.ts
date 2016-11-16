import * as sift from "sift";
import { serialize, deserialize } from "@tandem/common/serialize";
import { ParallelBus, CallbackDispatcher, FilterBus, SocketIOBus } from "@tandem/mesh";
import {
  Action,
  Logger,
  loggable,
  LoadAction,
  isPublicAction,
  isWorkerAction,
  InitializeAction,
  PropertyChangeAction,
} from "@tandem/common";
import { CoreApplicationService } from "@tandem/core";

@loggable()
export class IOService<T> extends CoreApplicationService<T> {

  readonly logger: Logger;

  public _remoteActors: Array<any>;

  [LoadAction.LOAD]() {

    // remote actors which take actions from the server
    this._remoteActors = [];

    // add the remote actors to the application so that they
    // receive actions from other parts of the application
    this.bus.register(
      new FilterBus(
        ((action: Action) => (isPublicAction(action) || isWorkerAction(action)) && !action["$$remote"]),
        new ParallelBus(this._remoteActors)
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
    this.logger.info("Client connected");

    // setup the bus which wil facilitate in all
    // transactions between the remote service
    const remoteBus = new SocketIOBus({ connection }, {
      dispatch: (action: Action) => {
        this.logger.verbose("Receive >>%s", action.type);

        // attach a flag so that the action does not get dispatched again
        return this.bus.dispatch(Object.assign(action, { $$remote: true }));
      }
    }, { serialize, deserialize });

    this._remoteActors.push({
      dispatch: (action: Action) => {
        this.logger.verbose("Broadcast <<%s", action.type);
        return remoteBus.dispatch(action);
      }
    });

    connection.once("disconnect", () => {
      this.logger.info("Client disconnected");

      this._remoteActors.splice(
        this._remoteActors.indexOf(remoteBus),
        1
      );

      remoteBus.dispose();
    });
  }
}