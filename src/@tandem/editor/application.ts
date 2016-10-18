import "reflect-metadata";
import { Application } from "@tandem/common/application";
import { ApplicationServiceDependency } from "@tandem/common";
import { 
  IFileSystem,
  RemoteFileSystem,
  RemoteFileResolver,
  FileCacheDependency,
  FileSystemDependency,
  FileResolverDependency,
} from "@tandem/sandbox";

// components
import { rootComponentDependency } from "./components/root";
import { layersPaneComponentDepency } from "./components/panes/layers";

// commponent tools
import { gridToolComponentDependency } from "./components/stage-tools/grid";
import { insertToolComponentDependency } from "./components/stage-tools/insert";
import { dragSelectComponentDependency } from "./components/stage-tools/drag-select";
import { selectorToolComponentDependency } from "./components/stage-tools/selector";
import { selectableToolComponentDependency } from "./components/stage-tools/selectable";

// services
import { workspaceDependency } from "./services/workspace";
import { editorServiceDependency } from "./services/editor";
import { backEndServiceDependency } from "./services/back-end";
import { selectorServiceDependency } from "./services/selector";
import { receiverServiceDependency } from "./services/receiver";
import { settingsServiceDependency } from "./services/settings";
import { clipboardServiceDependency } from "./services/clipboard";
import { keyBindingsServiceDependency } from "./services/key-binding";
import { rootComponentRendererDependency } from "./services/root-component-renderer";

// tools
import { pointerToolDependency } from "./models/pointer-tool";

// key bindings
import { keyBindingsDependency } from "./key-bindings";

// extensions
import { htmlExtensionDependencies } from "@tandem/html-extension";
import { sassExtensionDependencies  } from "@tandem/sass-extension";
import { pegjsExtensionDependencies } from "@tandem/peg-extension";
import { reactExtensionDependencies } from "@tandem/react-extension";
import { historyExtensionDependencies } from "@tandem/history-extension";
import { markdownExtensionDependencies } from "@tandem/markdown-extension";
import { mustacheExtensionDependencies } from "@tandem/mustache-extension";
import { tdprojectExtensionDependencies } from "@tandem/tdproject-extension";
import { typescriptExtensionDependencies } from "@tandem/typescript-extension";
import { javascriptExtensionDependencies } from "@tandem/javascript-extension";

import { Metadata } from "@tandem/common/metadata";
import { Editor } from "./models";

export class FrontEndApplication extends Application {

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
      selectorServiceDependency,
      settingsServiceDependency,
      receiverServiceDependency,
      clipboardServiceDependency,
      keyBindingsServiceDependency,
      rootComponentRendererDependency,

      // tools
      pointerToolDependency,

      // dependencies
      keyBindingsDependency,

      // extensions
      sassExtensionDependencies,
      htmlExtensionDependencies,
      reactExtensionDependencies,
      pegjsExtensionDependencies,
      historyExtensionDependencies,
      markdownExtensionDependencies,
      mustacheExtensionDependencies,
      tdprojectExtensionDependencies,
      javascriptExtensionDependencies,
      typescriptExtensionDependencies,

      // singletons
      new FileSystemDependency(this.config.fileSystem || new RemoteFileSystem(this.bus)),
      new FileResolverDependency(this.config.fileResolver || new RemoteFileResolver(this.bus)),
      new FileCacheDependency()
    );
  }
}