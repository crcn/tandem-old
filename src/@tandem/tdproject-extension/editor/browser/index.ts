import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { MimeTypeAliasProvider, MimeTypeProvider } from "@tandem/common";
import { TDArtboardStageToolComponent, ArtboardLoaderComponent } from "./components";
import { ReactComponentFactoryProvider, FooterComponentFactoryProvider } from "@tandem/editor/browser";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";


export function createTDProjectEditorBrowserProviders() {
  return [
    ...createTDProjectCoreProviders(),
    new ReactComponentFactoryProvider("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),
    new FooterComponentFactoryProvider("artboardLoader", ArtboardLoaderComponent),
  ];
}

export * from "../../core";