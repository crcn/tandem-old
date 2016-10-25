import { Dependencies } from "@tandem/common";
import { IEditorBrowserConfig } from "./config";
import { IFileSystem, IFileResolver } from "@tandem/sandbox";
import { concatCoreApplicationDependencies, ApplicationServiceDependency } from "@tandem/core";
import {
  SettingsDependency,
  ReactComponentFactoryDependency,
  StageToolComponentFactoryDependency,
  LayerLabelComponentFactoryDependency,
  DocumentPaneComponentFactoryDependency,
} from "./dependencies";

import {
  LayersPaneComponent,
  GridStageToolComponent,
  InsertStageToolComponent,
  SelectorStageToolComponent,
  DragSelectStageToolComponent,
  SelectableStageToolComponent,
} from "./components";

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

    // stage tool components
    new StageToolComponentFactoryDependency("selector", "pointer", SelectorStageToolComponent),
    new ReactComponentFactoryDependency("components/tools/pointer/drag-select", DragSelectStageToolComponent),
    new ReactComponentFactoryDependency("components/tools/pointer/grid", GridStageToolComponent),
    new ReactComponentFactoryDependency("components/tools/insert/size", InsertStageToolComponent),
    new StageToolComponentFactoryDependency("selectable", "pointer", SelectableStageToolComponent),

    // pane components
    new DocumentPaneComponentFactoryDependency("layers", LayersPaneComponent),

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