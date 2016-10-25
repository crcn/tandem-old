import { createHTMLCoreDependencies, createHTMLSandboxDependencies } from "../../index";

export const createHTMLEditorWorkerDependencies = () => {
  return [
    ...createHTMLCoreDependencies(),
    ...createHTMLSandboxDependencies()
  ];
}

export * from "../../core";