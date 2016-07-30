
import { Application } from "sf-common/application";
import { thread, isMaster } from "sf-core/workers";

// components
import { fragment as rootComponentDependency } from "./components/root";
import { fragment as selectableToolComponentDependency } from "./components/selectable-tool";

// services
import { fragment as projectsDependency } from "./services/project";
import { fragment as clipboardService } from "./services/clipboard";
import { fragment as backEndServiceDependency } from "./services/back-end";
import { fragment as selectorServiceDependency } from "./services/selector";
import { fragment as keyBindingsServiceDependency } from "./services/key-binding";
import { fragment as rootComponentRendererDependency } from "./services/root-component-renderer";

// key bindings
import { fragment as keyBindingsDependency } from "./key-bindings";

// extensions
import { fragment as htmlExtensionDependency } from "sf-html-extension";

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