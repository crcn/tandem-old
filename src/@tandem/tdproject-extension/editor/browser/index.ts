import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { MimeTypeAliasProvider, MimeTypeProvider } from "@tandem/common";

import { 
  ArtboardPaneComponent, 
  NavigatorPaneComponent, 
  ArtboardLoaderComponent, 
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
    new StageToolComponentFactoryProvider("artboard", "pointer", TDArtboardStageToolComponent),
    new StageToolComponentFactoryProvider("altDistances", "pointer", MeasurementStageToolComponent),
    new FooterComponentFactoryProvider("artboardLoader", ArtboardLoaderComponent),
    new EntityPaneComponentFactoryProvider("artboard", ArtboardPaneComponent)
  ];
}

export * from "../../core";