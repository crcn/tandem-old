import { MimeTypeProvider } from "@tandem/common";
import { createSASSSandboxDependencies } from "../../index";
import { BundlerLoaderFactoryProvider, ContentEditorFactoryProvider } from "@tandem/sandbox";

export const createSASSEditorWorkerDependencies = () => {
  return [
    ...createSASSSandboxDependencies()
  ];
};