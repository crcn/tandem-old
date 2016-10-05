import "reflect-metadata";
import { Application } from "@tandem/common/application";
import { thread, isMaster } from "@tandem/common/workers";

// components
import { rootComponentDependency } from "./components/root";
import { layersPaneComponentDepency } from "./components/document-layers-pane";

// commponent tools
import { gridToolComponentDependency } from "./components/grid-tool";
import { insertToolComponentDependency } from "./components/insert-tool";
import { dragSelectComponentDependency } from "./components/drag-select-tool";
import { selectorToolComponentDependency } from "./components/selector-tool";
import { selectableToolComponentDependency } from "./components/selectable-tool";

// services
import { clipboardServiceDependency } from "./services/clipboard";
import { workspaceDependency } from "./services/workspace";
import { editorServiceDependency } from "./services/editor";
import { backEndServiceDependency } from "./services/back-end";
import { historyServiceDependency } from "./services/history";
import { selectorServiceDependency } from "./services/selector";
import { settingsServiceDependency } from "./services/settings";
import { keyBindingsServiceDependency } from "./services/key-binding";
import { rootComponentRendererDependency } from "./services/root-component-renderer";

// tools
import { pointerToolDependency } from "./models/pointer-tool";

// key bindings
import { keyBindingsDependency } from "./key-bindings";

// extensions
import { sassExtensionDependency  } from "@tandem/sass-extension";
// import { angular2ExtensionDependency } from "@tandem/angular2-extension";
import { htmlExtensionDependency } from "@tandem/html-extension";
import { typescriptExtensionDependency } from "@tandem/typescript-extension";
import { javascriptExtensionDependency } from "@tandem/javascript-extension";

import { Metadata } from "@tandem/common/metadata";
import { Workspace, Editor } from "./models";

export class FrontEndApplication extends Application {

  public workspace: Workspace;
  public editor: Editor;
  public settings: Metadata;
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
      workspaceDependency,
      editorServiceDependency,
      backEndServiceDependency,
      historyServiceDependency,
      selectorServiceDependency,
      settingsServiceDependency,
      clipboardServiceDependency,
      keyBindingsServiceDependency,
      rootComponentRendererDependency,

      // tools
      pointerToolDependency,

      // dependencies
      keyBindingsDependency,

      // extensions
      sassExtensionDependency,
      htmlExtensionDependency,
      javascriptExtensionDependency,
      typescriptExtensionDependency,
      // angular2ExtensionDependency,
    );
  }
}