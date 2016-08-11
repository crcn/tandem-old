
import { Application } from "sf-common/application";
import { thread, isMaster } from "sf-core/workers";

// components
import { dependency as rootComponentDependency } from "./components/root";

// commponent tools
import { dependency as selectableToolComponentDependency } from "./components/selectable-tool";
import { dependency as selectorToolComponentDependency } from "./components/selector-tool";
import { dependency as gridToolComponentDependency } from "./components/grid-tool";
import { dependency as dragSelectComponentDependency } from "./components/drag-select-tool";

// services
import { dependency as projectsDependency } from "./services/project";
import { dependency as clipboardService } from "./services/clipboard";
import { dependency as editorServiceDependency } from "./services/editor";
import { dependency as backEndServiceDependency } from "./services/back-end";
import { dependency as selectorServiceDependency } from "./services/selector";
import { dependency as keyBindingsServiceDependency } from "./services/key-binding";
import { dependency as rootComponentRendererDependency } from "./services/root-component-renderer";

// tools
import { dependency as pointerToolDependency } from "./tools/pointer";

// key bindings
import { dependency as keyBindingsDependency } from "./key-bindings";

// extensions
import { dependency as htmlExtensionDependency } from "sf-html-extension";

// selections
import { dependency as displayEntitySelectionDependenciy } from "./selection/display-entity-collection";

import { Editor } from "./models";

export class FrontEndApplication extends Application {

  readonly editor = new Editor();

  protected registerDependencies() {
    super.registerDependencies();

    // this is primarily for testing
    if (this.config.registerFrontEndDependencies === false) return;

    this.dependencies.register(

      // components
      rootComponentDependency,

      // component tools
      selectableToolComponentDependency,
      selectorToolComponentDependency,
      gridToolComponentDependency,
      dragSelectComponentDependency,

      // services
      clipboardService,
      projectsDependency,
      editorServiceDependency,
      backEndServiceDependency,
      selectorServiceDependency,
      keyBindingsServiceDependency,
      rootComponentRendererDependency,

      // tools
      pointerToolDependency,

      // selection
      displayEntitySelectionDependenciy,

      // dependencies
      keyBindingsDependency,

      // extensions
      htmlExtensionDependency
    );
  }
}