import { MimeTypeProvider } from "@tandem/common";
import { createSASSSandboxProviders } from "../../index";
import { DependencyLoaderFactoryProvider, ContentEditorFactoryProvider } from "@tandem/sandbox";

export const createSASSEditorWorkerProviders = () => {
  return [
    ...createSASSSandboxProviders()
  ];
};