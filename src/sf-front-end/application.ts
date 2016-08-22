import { Application } from "sf-common/application";
import { thread, isMaster } from "sf-core/workers";

// components
import { dependency as rootComponentDependency } from "./components/root";
import { dependency as layersPaneComponentDepency } from "./components/document-layers-pane";

// commponent tools
import { dependency as gridToolComponentDependency } from "./components/grid-tool";
import { dependency as insertToolComponentDependency } from "./components/insert-tool";
import { dependency as dragSelectComponentDependency } from "./components/drag-select-tool";
import { dependency as selectorToolComponentDependency } from "./components/selector-tool";
import { dependency as selectableToolComponentDependency } from "./components/selectable-tool";

// services
import { dependency as clipboardService } from "./services/clipboard";
import { dependency as workspaceDependency } from "./services/workspace";
import { dependency as editorServiceDependency } from "./services/editor";
import { dependency as backEndServiceDependency } from "./services/back-end";
import { dependency as historyServiceDependency } from "./services/history";
import { dependency as selectorServiceDependency } from "./services/selector";
import { dependency as settingsServiceDependency } from "./services/settings";
import { dependency as keyBindingsServiceDependency } from "./services/key-binding";
import { dependency as rootComponentRendererDependency } from "./services/root-component-renderer";

// tools
import { dependency as pointerToolDependency } from "./models/pointer-tool";

// key bindings
import { dependency as keyBindingsDependency } from "./key-bindings";

// extensions
import { dependency as htmlExtensionDependency } from "sf-html-extension";

import { Metadata } from "sf-core/metadata";
import { Workspace, Settings } from "./models";

export class FrontEndApplication extends Application {

  public workspace: Workspace;
  public settings: Settings;
  public metadata: Metadata;

  constructor(config?: any) {
    super(config);
    this.metadata = new Metadata();
    this.metadata.observe(this.bus);
  }

  protected registerDependencies() {
    super.registerDependencies();

    // this is primarily for testing
    if (this.config.registerFrontEndDependencies === false) return;

    this.dependencies.register(

      // components
      rootComponentDependency,
      layersPaneComponentDepency,

      // component tools
      gridToolComponentDependency,
      insertToolComponentDependency,
      dragSelectComponentDependency,
      selectorToolComponentDependency,
      selectableToolComponentDependency,

      // services
      clipboardService,
      workspaceDependency,
      editorServiceDependency,
      backEndServiceDependency,
      historyServiceDependency,
      selectorServiceDependency,
      settingsServiceDependency,
      keyBindingsServiceDependency,
      rootComponentRendererDependency,

      // tools
      pointerToolDependency,

      // dependencies
      keyBindingsDependency,

      // extensions
      htmlExtensionDependency
    );
  }
}