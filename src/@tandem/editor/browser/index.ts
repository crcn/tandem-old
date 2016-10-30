import "./styles";

import { Dependencies } from "@tandem/common";
import { IEditorBrowserConfig } from "./config";
import { IFileSystem, IFileResolver } from "@tandem/sandbox";
import { createCoreApplicationDependencies, ApplicationServiceDependency } from "@tandem/core";
import {
  StoreDependency,
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

import { Store } from "./models";

import { createCommonEditorDependencies } from "../common";

import {
  DNDService,
  ServerService,
  SettingsService,
  ClipboardService,
  ComponentService,
  WorkspaceService,
  GlobalKeyBindingService,
} from "./services";

export function concatEditorBrowserDependencies(dependencies: Dependencies, config: IEditorBrowserConfig, fileSystemClass?: { new(): IFileSystem }, fileResolverClass?: { new(): IFileResolver }) {
  return new Dependencies(
    dependencies,
    createCommonEditorDependencies(),
    createCoreApplicationDependencies(config, fileSystemClass, fileResolverClass),

    // services
    new ApplicationServiceDependency("dnd", DNDService),
    new ApplicationServiceDependency("server", ServerService),
    new ApplicationServiceDependency("settings", SettingsService),
    new ApplicationServiceDependency("clipboard", ClipboardService),
    new ApplicationServiceDependency("component", ComponentService),
    new ApplicationServiceDependency("workspace", WorkspaceService),
    new ApplicationServiceDependency("keyBindings", GlobalKeyBindingService),

    // stage tool components
    new StageToolComponentFactoryDependency("selector", "pointer", SelectorStageToolComponent),
    new ReactComponentFactoryDependency("components/tools/pointer/drag-select", DragSelectStageToolComponent as any),
    new ReactComponentFactoryDependency("components/tools/pointer/grid", GridStageToolComponent),
    new ReactComponentFactoryDependency("components/tools/insert/size", InsertStageToolComponent),
    new StageToolComponentFactoryDependency("selectable", "pointer", SelectableStageToolComponent),

    // pane components
    new DocumentPaneComponentFactoryDependency("layers", LayersPaneComponent),

    new StoreDependency(Store),

    // pointerToolDependency
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