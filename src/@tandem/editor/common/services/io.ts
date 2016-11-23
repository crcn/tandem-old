import * as sift from "sift";
import { serialize, deserialize } from "@tandem/common/serialize";
import { ParallelBus, CallbackDispatcher, FilterBus, SocketIOBus, filterFamilyMessage } from "@tandem/mesh";
import {
  Action,
  Logger,
  loggable,
  InitializeRequest,
} from "@tandem/common";
import { IEditorCommonConfig } from "@tandem/editor/common/config";
import { CoreApplicationService } from "@tandem/core";

@loggable()
export class IOService<T extends  IEditorCommonConfig> extends CoreApplicationService<T> {

  readonly logger: Logger;

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
    const remoteBus = new SocketIOBus({ family: this.config.family, connection, testMessage: filterFamilyMessage }, {
      dispatch: (action: Action) => {
        // attach a flag so that the action does not get dispatched again
        return this.bus.dispatch(Object.assign(action, { $$remote: true }));
      }
    }, { serialize, deserialize });

    this.bus.register(remoteBus);

    connection.once("disconnect", () => {
      this.logger.info("Client disconnected");
      this.bus.unregister(remoteBus);
      remoteBus.dispose();
    });
  }
}