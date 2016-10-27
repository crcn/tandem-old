import { MimeTypeDependency } from "@tandem/common";
import { createSASSSandboxDependencies } from "../../index";
import { BundlerLoaderFactoryDependency, ContentEditorFactoryDependency } from "@tandem/sandbox";

export const createSASSEditorWorkerDependencies = () => {
  return [
    ...createSASSSandboxDependencies()
  ];
};