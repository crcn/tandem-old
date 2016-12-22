import { SpawnWorkerRequest } from "../messages";
import { BaseEditorMasterCommand } from "./base";
import { OpenProjectEnvironmentChannelRequest } from "@tandem/editor/common";
import { ChannelBus, DuplexStream, CallbackDispatcher, IMessage, MemoryDataStore } from "@tandem/mesh";
import { 
  Kernel, 
  DSService,
  BrokerBus, 
  DSProvider,
  ServiceApplication, 
  PrivateBusProvider, 
  ApplicationServiceProvider,
} from "@tandem/common";

// TODO - return existing environments
export class OpenProjectEnvironmentChannelCommand extends BaseEditorMasterCommand {
  execute(request: OpenProjectEnvironmentChannelRequest) {
    return new DuplexStream(async (input, output) => {

      const channelBus = (this.store.channels[request.projectId] || (this.store.channels[request.projectId] = ChannelBus.createFromStream(this.bus.dispatch(new SpawnWorkerRequest({
        ENV_ID: request.projectId
      }))))) as ChannelBus;

      channelBus["connectionCount"] = (channelBus["connectionCount"] || 0) + 1;

      return new ChannelBus(input, output, channelBus, () => {
        if (!(--channelBus["connectionCount"])) {
          this.store.channels[request.projectId] = undefined;
          channelBus.dispose();
        }
      });
    });
  }
}