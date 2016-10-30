import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreDependencies } from "../../core";
import { MimeTypeProvider, MimeTypeAliasProvider } from "@tandem/common";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";

export const createTDProjectEditorServerDependencies = () => {
  return [
    ...createTDProjectCoreDependencies()
  ];
}

export * from "../../core";