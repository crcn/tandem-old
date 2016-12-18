import { Application } from "@tandem/common";
import { ApplicationServiceProvider, ApplicationConfigurationProvider } from "./providers";

import {
  BrokerBus,
  Kernel,
  PrivateBusProvider,
  KernelProvider,
  registerableProviderType,
} from "@tandem/common";

import { SequenceBus } from "@tandem/mesh";

import {
  IFileResolver,
  createSandboxProviders,
} from "@tandem/sandbox";

function createBusProviders() {

  const privateBus   = new BrokerBus(SequenceBus);

  return new Kernel(
    new PrivateBusProvider(privateBus),
  );
}

export function createCoreApplicationProviders(config: any, fileResolverClass?: { new(): IFileResolver }) {
  return new Kernel(
    createBusProviders(),
    new KernelProvider(),
    new ApplicationConfigurationProvider(config),
    createSandboxProviders(fileResolverClass),
  );
}

export class ServiceApplication extends Application {
  willLoad() {
    super.willLoad();

    // create the services before loading so that they can hook themselves into the application
    // context.
    for (const serviceProvider of ApplicationServiceProvider.findAll(this.kernel)) {
      serviceProvider.create();
    }
  }
}

export * from "./providers";
export * from "./services";