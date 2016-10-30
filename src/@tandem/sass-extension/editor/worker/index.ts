import { MimeTypeProvider } from "@tandem/common";
import { createSASSSandboxProviders } from "../../index";
import { BundlerLoaderFactoryProvider, ContentEditorFactoryProvider } from "@tandem/sandbox";

export const createSASSEditorWorkerProviders = () => {
  return [
    ...createSASSSandboxProviders()
  ];
};