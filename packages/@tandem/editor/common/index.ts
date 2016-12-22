import { IFileResolver } from "@tandem/sandbox";
import { ConsoleLogService, ReceiverService } from "./services";
import { createSandboxProviders, URIProtocolProvider } from "@tandem/sandbox";
import { 
  Kernel, 
  BrokerBus, 
  IProvider,
  KernelProvider, 
  PrivateBusProvider, 
  ApplicationServiceProvider,
  ApplicationConfigurationProvider,
} from "@tandem/common";

export const createCommonEditorProviders = (config?: any, fileResolverClass?: { new(): IFileResolver }) => {
  return [
    new PrivateBusProvider(new BrokerBus()),
    new KernelProvider(),
    new ApplicationConfigurationProvider(config),
    createSandboxProviders(fileResolverClass),
    new ApplicationServiceProvider("console", ConsoleLogService),
    new ApplicationServiceProvider("receiver", ReceiverService)
  ];
}

export * from "./services";
// export * from "./models";
export * from "./config";
export * from "./messages";
export * from "./stores";

// export external modules that contain requests & other
// assets that will need to be wired up by some backend
export * from "@tandem/synthetic-browser";
export * from "@tandem/sandbox";