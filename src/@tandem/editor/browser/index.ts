import { Dependencies } from "@tandem/common";
import { SettingsDependency } from "./dependencies";
import { IEditorBrowserConfig } from "./config";
import { IFileSystem, IFileResolver } from "@tandem/sandbox";
import { concatCoreApplicationDependencies, ApplicationServiceDependency } from "../core";

import {
  SettingsService,
  ClipboardService,
  ComponentService,
  GlobalKeyBindingService,
} from "./services";

export function concatEditorBrowserDependencies(dependencies: Dependencies, config: IEditorBrowserConfig, fileSystem?: IFileSystem, fileResolver?: IFileResolver) {
  return new Dependencies(
    concatCoreApplicationDependencies(dependencies, config, fileSystem, fileResolver),

    // services
    new ApplicationServiceDependency("settings", SettingsService),
    new ApplicationServiceDependency("clipboard", ClipboardService),
    new ApplicationServiceDependency("component", ComponentService),
    new ApplicationServiceDependency("keyBindings", GlobalKeyBindingService),

    // models
    new SettingsDependency(),
  );
}

export * from "./actions";
export * from "./config";
export * from "./collections";
export * from "./components";
export * from "./constants";
export * from "./dependencies";
export * from "./key-bindings";
export * from "./models";
export * from "./services";
export * from "./application";
export * from "../core";