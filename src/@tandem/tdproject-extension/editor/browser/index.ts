import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { MimeTypeAliasProvider, MimeTypeProvider } from "@tandem/common";
import { TDArtboardStageToolComponent, ArtboardLoaderComponent, NavigatorPaneComponent, MeasurementStageToolComponent } from "./components";
import { ReactComponentFactoryProvider, FooterComponentFactoryProvider, DocumentPaneComponentFactoryProvider, StageToolComponentFactoryProvider } from "@tandem/editor/browser";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider} from "@tandem/synthetic-browser";


export function createTDProjectEditorBrowserProviders() {
  return [
    ...createTDProjectCoreProviders(),
    // new DocumentPaneComponentFactoryProvider("navigator", NavigatorPaneComponent),
    new StageToolComponentFactoryProvider("artboard", "pointer", TDArtboardStageToolComponent),
    new StageToolComponentFactoryProvider("altDistances", "pointer", MeasurementStageToolComponent),
    new FooterComponentFactoryProvider("artboardLoader", ArtboardLoaderComponent),
  ];
}

export * from "../../core";