import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { 
  PostDSMessage, 
  MimeTypeProvider, 
  MimeTypeAliasProvider, 
  CommandFactoryProvider,
  ApplicationReadyMessage, 
} from "@tandem/common";

import { LoadUnsavedFileCommand } from "./commands";
import { TDProjectExtensionStore } from "./stores";
import { TandemExtensionStoreProvider } from "./providers";

import { 
  ArtboardPaneComponent, 
  NavigatorPaneComponent, 
  ArtboardLoaderComponent, 
  UnsavedFilesPaneComponent,
  ArtboardLayerLabelComponent,
  TDArtboardStageToolComponent, 
  MeasurementStageToolComponent,
} from "./components";

import { ElementLayerLabelProvider } from "@tandem/html-extension/editor/browser";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider} from "@tandem/synthetic-browser";
import { 
  ReactComponentFactoryProvider, 
  FooterComponentFactoryProvider, 
  StageToolComponentFactoryProvider, 
  EntityPaneComponentFactoryProvider,
  DocumentPaneComponentFactoryProvider, 
} from "@tandem/editor/browser";



export function createTDProjectEditorBrowserProviders() {
  return [
    ...createTDProjectCoreProviders(),
    // new DocumentPaneComponentFactoryProvider("navigator", NavigatorPaneComponent),
    new ElementLayerLabelProvider("artboard", ArtboardLayerLabelComponent),
    new TandemExtensionStoreProvider(TDProjectExtensionStore),
    new StageToolComponentFactoryProvider("artboard", "pointer", TDArtboardStageToolComponent),
    new DocumentPaneComponentFactoryProvider("unsavedFiles", UnsavedFilesPaneComponent, 999),
    new StageToolComponentFactoryProvider("altDistances", "pointer", MeasurementStageToolComponent),
    new FooterComponentFactoryProvider("artboardLoader", ArtboardLoaderComponent),
    new EntityPaneComponentFactoryProvider("artboard", ArtboardPaneComponent),
    new CommandFactoryProvider(ApplicationReadyMessage.READY, LoadUnsavedFileCommand),
    new CommandFactoryProvider(PostDSMessage.DS_DID_UPDATE, LoadUnsavedFileCommand),
    new CommandFactoryProvider(PostDSMessage.DS_DID_INSERT, LoadUnsavedFileCommand),
    new CommandFactoryProvider(PostDSMessage.DS_DID_REMOVE, LoadUnsavedFileCommand)
  ];
}

export * from "../../core";