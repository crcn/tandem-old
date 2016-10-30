// import "reflect-metadata";
// import { createSyntheticBrowserWorkerDependencies } from "@tandem/synthetic-browser";
// import { Application, ApplicationServiceProvider, isMaster } from "@tandem/common";
// import { 
//   FileEditor,
//   IFileSystem,
//   RemoteFileSystem,
//   BundlerProvider,
//   RemoteFileResolver,
//   FileCacheProvider,
//   FileSystemProvider,
//   FileEditorProvider,
//   FileResolverProvider,
//   createSandboxDependencies,
// } from "@tandem/sandbox";

// // components
// import { rootComponentProvider } from "./components/root";
// import { layersPaneComponentDepency } from "./components/panes/layers";

// // commponent tools
// import { gridToolComponentProvider } from "./components/stage-tools/grid";
// import { insertToolComponentProvider } from "./components/stage-tools/insert";
// import { dragSelectComponentProvider } from "./components/stage-tools/drag-select";
// import { selectorToolComponentProvider } from "./components/stage-tools/selector";
// import { selectableToolComponentProvider } from "./components/stage-tools/selectable";

// // services
// import { workspaceProvider } from "./services/workspace";
// import { editorServiceProvider } from "./services/editor";
// import { backEndServiceProvider } from "./services/back-end";
// import { selectorServiceProvider } from "./services/selector";
// import { receiverServiceProvider } from "./services/receiver";
// import { settingsServiceProvider } from "./services/settings";
// import { clipboardServiceProvider } from "./services/clipboard";
// import { keyBindingsServiceProvider } from "./services/key-binding";
// import { rootComponentRendererProvider } from "./services/root-component-renderer";

// // tools
// import { pointerToolProvider } from "./models/pointer-tool";

// // key bindings
// import { keyBindingsProvider } from "./key-bindings";

// // extensions
// import { htmlExtensionDependencies } from "@tandem/html-extension";
// import { sassExtensionDependencies  } from "@tandem/sass-extension";
// import { tdprojectExtensionDependencies } from "@tandem/tdproject-extension";

// import { Workspace } from "./models";
// import { Metadata } from "@tandem/common/metadata";

// export class FrontEndApplication extends Application {

//   // TODO - change this to something else - maybe workspace
//   public workspace: Workspace;
//   public settings: Metadata;
//   public metadata: Metadata;

//   constructor(config?: any) {
//     super(config);
//     this.metadata = new Metadata();
//     this.metadata.observe(this.bus);
//   }

//   protected registerDependencies() {
//     super.registerDependencies();

//     // this is primarily for testing
//     if (this.config.registerFrontEndDependencies === false) return;

//     const masterDependencies = [];
//     const workerDependencies = [];

//     // TODO - check if nodejs
//     if (isMaster) {
//       masterDependencies.push(

//         // components
//         rootComponentProvider,
//         layersPaneComponentDepency,

//         // tools
//         pointerToolProvider,

//         // services
//         workspaceProvider,

//         // dependencies
//         keyBindingsProvider,

//         // component tools
//         gridToolComponentProvider,
//         insertToolComponentProvider,
//         dragSelectComponentProvider,
//         selectorToolComponentProvider,
//         selectableToolComponentProvider,

//         clipboardServiceProvider,
//         keyBindingsServiceProvider,
//         rootComponentRendererProvider,
//       );
//     } else {
//       workerDependencies.push(
//         createSyntheticBrowserWorkerDependencies()
//       );
//     }

//     this.dependencies.register(

//       ...masterDependencies,
//       ...workerDependencies,

//       editorServiceProvider,
//       backEndServiceProvider,
//       selectorServiceProvider,
//       settingsServiceProvider,
//       receiverServiceProvider,

//       // extensions
//       sassExtensionDependencies,
//       htmlExtensionDependencies,
//       historyExtensionDependencies,
//       tdprojectExtensionDependencies,

//       // singletons
//       ...createSandboxDependencies(
//         this.config.fileSystem || new RemoteFileSystem(this.bus),
//         this.config.fileResolver || new RemoteFileResolver(this.bus)
//       )
//     );
//   }
// }