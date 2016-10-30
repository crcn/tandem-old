import "./styles";

import { Injector } from "@tandem/common";
import { IEditorBrowserConfig } from "./config";
import { IFileSystem, IFileResolver } from "@tandem/sandbox";
import { createCoreApplicationDependencies, ApplicationServiceProvider } from "@tandem/core";
import {
  StoreProvider,
  ReactComponentFactoryProvider,
  StageToolComponentFactoryProvider,
  LayerLabelComponentFactoryProvider,
  DocumentPaneComponentFactoryProvider,
} from "./providers";

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

export function concatEditorBrowserDependencies(dependencies: Injector, config: IEditorBrowserConfig, fileSystemClass?: { new(): IFileSystem }, fileResolverClass?: { new(): IFileResolver }) {
  return new Injector(
    dependencies,
    createCommonEditorDependencies(),
    createCoreApplicationDependencies(config, fileSystemClass, fileResolverClass),

    // services
    new ApplicationServiceProvider("dnd", DNDService),
    new ApplicationServiceProvider("server", ServerService),
    new ApplicationServiceProvider("settings", SettingsService),
    new ApplicationServiceProvider("clipboard", ClipboardService),
    new ApplicationServiceProvider("component", ComponentService),
    new ApplicationServiceProvider("workspace", WorkspaceService),
    new ApplicationServiceProvider("keyBindings", GlobalKeyBindingService),

    // stage tool components
    new StageToolComponentFactoryProvider("selector", "pointer", SelectorStageToolComponent),
    new ReactComponentFactoryProvider("components/tools/pointer/drag-select", DragSelectStageToolComponent as any),
    new ReactComponentFactoryProvider("components/tools/pointer/grid", GridStageToolComponent),
    new ReactComponentFactoryProvider("components/tools/insert/size", InsertStageToolComponent),
    new StageToolComponentFactoryProvider("selectable", "pointer", SelectableStageToolComponent),

    // pane components
    new DocumentPaneComponentFactoryProvider("layers", LayersPaneComponent),

    new StoreProvider(Store),

    // pointerToolProvider
  );
}

export * from "./actions";
export * from "./config";
export * from "./collections";
export * from "./components";
export * from "./constants";
export * from "./providers";
export * from "./key-bindings";
export * from "./models";
export * from "./services";
export * from "./application";