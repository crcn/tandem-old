import { Application2 } from "@tandem/common";
import { ApplicationServiceDependency, ApplicationConfigurationDependency } from "./dependencies";

import {
  BrokerBus,
  Dependencies,
  PublicBusDependency,
  PrivateBusDependency,
  ProtectedBusDependency,
  DependenciesDependency,
  registerableDependencyType,
} from "@tandem/common";

import { SequenceBus } from "mesh";

import {
  IFileSystem,
  IFileResolver,
  LocalFileSystem,
  RemoteFileSystem,
  LocalFileResolver,
  RemoteFileResolver,
  concatSandboxDependencies,
} from "@tandem/sandbox";

// TODO - possibly move these to @tandem/core since this configuration is
// required by *all* packages that use the application bus
function concatBusDependencies(dependencies: Dependencies) {

  // Notice the bubbling action here. Actions dispatched on the private bus will
  // make its way to the public bus. However, actions also have access levels. If an action
  // invoked against the public bus is not also public, then the action will never reach the outside world.

  // The levels here are mainly intented to expose layers of the application that are publicly accessible
  // to outside resources. The public bus is intented for public APIs, and is accessible to anyone, The protected bus is
  // available to trusted resources such as workers, databases, and other services. The private bus is reserved for internal
  // communication including things such as application loading, initialization, rendering (browser), and other actions
  // that are useless to both public, and protected actors.

  const publicBus    = new BrokerBus(SequenceBus);
  const protectedBus = new BrokerBus(SequenceBus, publicBus);
  const privateBus   = new BrokerBus(SequenceBus, protectedBus);

  return new Dependencies(
    dependencies,
    new PublicBusDependency(publicBus),
    new ProtectedBusDependency(protectedBus),
    new PrivateBusDependency(privateBus),
  );
}

export function concatCoreApplicationDependencies(dependencies: Dependencies, config: any, fileSystem?: IFileSystem, fileResolver?: IFileResolver) {

  dependencies = new Dependencies(
    dependencies,
    new DependenciesDependency(),
    new ApplicationConfigurationDependency(config),
  );

  dependencies = concatBusDependencies(dependencies);
  dependencies = concatSandboxDependencies(dependencies, fileSystem, fileResolver);

  return dependencies;
}

export class ServiceApplication extends Application2 {
  willLoad() {

    // create the services before loading so that they can hook themselves into the application
    // context.
    for (const serviceDependency of ApplicationServiceDependency.findAll(this.dependencies)) {
      serviceDependency.create();
    }
  }
}

export * from "./dependencies";
export * from "./services";