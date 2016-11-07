import { MimeTypeProvider } from "@tandem/common";
import { CSSSyntaxProvider } from "@tandem/synthetic-browser/providers";
import { createSASSSandboxProviders } from "../../index";
import { DependencyLoaderFactoryProvider, ContentEditorFactoryProvider } from "@tandem/sandbox";

export const createSASSEditorWorkerProviders = () => {
  return [
    ...createSASSSandboxProviders()
  ];
};