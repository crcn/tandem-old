
import { Application } from "sf-common/application";
import { thread, isMaster } from "sf-core/workers";

// components
import { dependency as rootComponentDependency } from "./components/root";
import { dependency as selectableToolComponentDependency } from "./components/selectable-tool";

// services
import { dependency as projectsDependency } from "./services/project";
import { dependency as clipboardService } from "./services/clipboard";
import { dependency as backEndServiceDependency } from "./services/back-end";
import { dependency as selectorServiceDependency } from "./services/selector";
import { dependency as keyBindingsServiceDependency } from "./services/key-binding";
import { dependency as rootComponentRendererDependency } from "./services/root-component-renderer";

// key bindings
import { dependency as keyBindingsDependency } from "./key-bindings";

// extensions
import { dependency as htmlExtensionDependency } from "sf-html-extension";

// selections
import { dependency as visibleEntitiySelectionDependency } from "./selection/visible-entity-collection";

import { Editor } from "./models";

export class FrontEndApplication extends Application {

  readonly editor = new Editor();

  protected registerDependencies() {
    super.registerDependencies();
    this.dependencies.register(

      // components
      rootComponentDependency,
      selectableToolComponentDependency,

      // services
      clipboardService,
      projectsDependency,
      backEndServiceDependency,
      selectorServiceDependency,
      keyBindingsServiceDependency,
      rootComponentRendererDependency,

      // selection
      visibleEntitiySelectionDependency,

      // dependencies
      keyBindingsDependency,

      // extensions
      htmlExtensionDependency
    );
  }
}