
import { Application } from "sf-common/application";
import { thread, isMaster } from "sf-core/workers";

// components
import { fragment as rootComponentFragment } from "./components/root";
import { fragment as sfnStageComponentFragment } from "./components/sfn-stage";
import { fragment as selectableToolComponentFragment } from "./components/selectable-tool";

// services
import { fragment as projectsFragment } from "./services/project";
import { fragment as clipboardService } from "./services/clipboard";
import { fragment as backEndServiceFragment } from "./services/back-end";
import { fragment as selectorServiceFragment } from "./services/selector";
import { fragment as keyBindingsServiceFragment } from "./services/key-binding";
import { fragment as rootComponentRendererFragment } from "./services/root-component-renderer";

// key bindings
import { fragment as keyBindingsFragment } from "./key-bindings";

// extensions
import { fragment as htmlExtensionFragment } from "sf-html-extension";

import { Editor } from "./models";

export class FrontEndApplication extends Application {

  readonly editor = new Editor();

  protected registerFragments() {
    super.registerFragments();
    this.fragments.register(

      // components
      rootComponentFragment,
      sfnStageComponentFragment,
      selectableToolComponentFragment,

      // services
      clipboardService,
      projectsFragment,
      backEndServiceFragment,
      selectorServiceFragment,
      keyBindingsServiceFragment,
      rootComponentRendererFragment,

      // fragments
      keyBindingsFragment,

      // extensions
      htmlExtensionFragment
    );
  }
}