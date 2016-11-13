import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { MimeTypeProvider, MimeTypeAliasProvider } from "@tandem/common";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";

export const createTDProjectEditorWorkerProviders = () => {
  return [
    ...createTDProjectCoreProviders()
  ];
}

export * from "../../core";