import sift = require("sift");
import { serialize, deserialize } from "@tandem/common/serialize";
import { ParallelBus, IMessage, CallbackDispatcher, FilterBus, SocketIOBus, filterFamilyMessage, setMessageClientId } from "@tandem/mesh";
import {
  Logger,
  loggable,
  CoreApplicationService,
  InitializeApplicationRequest,
} from "@tandem/common";
import { IEditorCommonConfig } from "@tandem/editor/common/config";
import { IOClientConnectedMessage, IOClientDisconnectedMessage } from "../messages";

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
    this.logger.info(`Client connected: ${connection.id}`);
    
    // TODO - attach connection ID metadata
    // setup the bus which wil facilitate in all
    // transmessages between the remote service
    const remoteBus = new SocketIOBus({ 
      family: this.config.family, 
      connection, 
      testMessage: filterFamilyMessage 
    }, new CallbackDispatcher((message) => {
      setMessageClientId(connection.id, message);
      return this.bus.dispatch(message);
    }), { serialize, deserialize: (data) => deserialize(data, this.kernel) });
    

    this.bus.register(remoteBus);

    // notify the app that a client has connected 
    this.bus.dispatch(new IOClientConnectedMessage(remoteBus));

    connection.once("disconnect", () => {
      this.logger.info("Client disconnected");
      this.bus.unregister(remoteBus);
      const message = new IOClientDisconnectedMessage();
      setMessageClientId(connection.id, message);
      this.bus.dispatch(message);
      remoteBus.dispose();
    });
  }
}