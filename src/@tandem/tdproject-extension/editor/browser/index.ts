import { TDArtboardStageToolComponent } from "./components";
import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { ReactComponentFactoryProvider } from "@tandem/editor/browser";
import { createTDProjectCoreDependencies } from "../../core";
import { MimeTypeAliasProvider, MimeTypeProvider } from "@tandem/common";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";


export function createTDProjectEditorBrowserDependencies() {
  return [
    ...createTDProjectCoreDependencies(),
    new ReactComponentFactoryProvider("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),
  ]
}

export * from "../../core";