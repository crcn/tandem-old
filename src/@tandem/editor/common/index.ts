import { Injector } from "@tandem/common";
import { IFileSystem, IFileResolver } from "@tandem/sandbox";
import { ConsoleLogService, ReceiverService } from "./services";
import { createCoreApplicationProviders, ApplicationServiceProvider } from "@tandem/core";

export const createCommonEditorProviders = (config?: any, fileSystemClass?: { new(): IFileSystem }, fileResolverClass?: { new(): IFileResolver }) => {
  return [
    createCoreApplicationProviders(config),
    new ApplicationServiceProvider("console", ConsoleLogService),
    new ApplicationServiceProvider("receiver", ReceiverService)
  ];
}

export * from "./services";
export * from "./models";
export * from "./config";
export * from "./messages";

// export external modules that contain requests & other
// assets that will need to be wired up by some backend
export * from "@tandem/synthetic-browser";
export * from "@tandem/sandbox";