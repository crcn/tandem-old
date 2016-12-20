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
      const channelBus = ChannelBus.createFromStream(this.bus.dispatch(new SpawnWorkerRequest({
        ENV_ID: request.projectId
      })));


      return new ChannelBus(input, output, channelBus, () => {
        channelBus.dispose();
      });

      
      // const envBus = new BrokerBus();

      // const envKernel = new Kernel(
      //   this.kernel,

      //   // TODO - probably want to use something such as redis to ensure that 
      //   // multiple users are hooked up to the same environment
      //   new DSProvider(new MemoryDataStore()),
      //   new PrivateBusProvider(envBus),
      //   new ApplicationServiceProvider("ds", DSService),
      // );

      // const env = new ServiceApplication(envKernel);
      
      // await env.initialize();

      // console.log("INITING");
    
      // const remoteBus = new ChannelBus(input, output, envBus, () => {
      //   console.log("CLOSING");
      // });
    });
  }
}