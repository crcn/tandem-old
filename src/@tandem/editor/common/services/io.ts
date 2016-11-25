import * as sift from "sift";
import { serialize, deserialize } from "@tandem/common/serialize";
import { ParallelBus, IMessage, CallbackDispatcher, FilterBus, SocketIOBus, filterFamilyMessage } from "@tandem/mesh";
import {
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
      dispatch: (message: IMessage) => {
        // attach a flag so that the action does not get dispatched again
        return this.bus.dispatch(Object.assign(message, { $$remote: true }));
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