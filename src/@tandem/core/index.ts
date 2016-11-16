import { Application } from "@tandem/common";
import { ApplicationServiceProvider, ApplicationConfigurationProvider } from "./providers";

import {
  BrokerBus,
  Injector,
  PrivateBusProvider,
  InjectorProvider,
  registerableProviderType,
} from "@tandem/common";

import { SequenceBus } from "@tandem/mesh";

import {
  IFileSystem,
  IFileResolver,
  LocalFileSystem,
  RemoteFileSystem,
  LocalFileResolver,
  RemoteFileResolver,
  createSandboxProviders,
} from "@tandem/sandbox";

function createBusProviders() {

  const privateBus   = new BrokerBus(SequenceBus);

  return new Injector(
    new PrivateBusProvider(privateBus),
  );
}

export function createCoreApplicationProviders(config: any, fileSystemClass?: { new(): IFileSystem }, fileResolverClass?: { new(): IFileResolver }) {
  return new Injector(
    createBusProviders(),
    new InjectorProvider(),
    new ApplicationConfigurationProvider(config),
    createSandboxProviders(fileSystemClass, fileResolverClass),
  );
}

export class ServiceApplication extends Application {
  willLoad() {
    super.willLoad();

    // create the services before loading so that they can hook themselves into the application
    // context.
    for (const serviceProvider of ApplicationServiceProvider.findAll(this.injector)) {
      serviceProvider.create();
    }
  }
}

export * from "./providers";
export * from "./services";