import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { MimeTypeAliasProvider, MimeTypeProvider } from "@tandem/common";
import { TDArtboardStageToolComponent, ArtboardLoaderComponent, NavigatorPaneComponent } from "./components";
import { ReactComponentFactoryProvider, FooterComponentFactoryProvider, DocumentPaneComponentFactoryProvider } from "@tandem/editor/browser";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";


export function createTDProjectEditorBrowserProviders() {
  return [
    ...createTDProjectCoreProviders(),
    new DocumentPaneComponentFactoryProvider("navigator", NavigatorPaneComponent),
    new ReactComponentFactoryProvider("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),
    new FooterComponentFactoryProvider("artboardLoader", ArtboardLoaderComponent),
  ];
}

export * from "../../core";