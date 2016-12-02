import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { MimeTypeAliasProvider, MimeTypeProvider } from "@tandem/common";

import { 
  ArtboardPaneComponent, 
  NavigatorPaneComponent, 
  ArtboardLoaderComponent, 
  TDArtboardStageToolComponent, 
  MeasurementStageToolComponent,
} from "./components";

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
    new StageToolComponentFactoryProvider("artboard", "pointer", TDArtboardStageToolComponent),
    new StageToolComponentFactoryProvider("altDistances", "pointer", MeasurementStageToolComponent),
    new FooterComponentFactoryProvider("artboardLoader", ArtboardLoaderComponent),
    new FooterComponentFactoryProvider("artboardLoader", ArtboardLoaderComponent),
    new EntityPaneComponentFactoryProvider("artboard", ArtboardPaneComponent)
  ];
}

export * from "../../core";