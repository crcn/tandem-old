// note unused imports - fixes --declaration issue with typescript

import { MimeTypeProvider } from "@tandem/common";
import { createHTMLCoreProviders, createHTMLSandboxProviders } from "../../index";
import {
  DependencyLoaderFactoryProvider,
  ContentEditorFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

import { SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";

export const createHTMLEditorWorkerProviders = () => {
  return [
    ...createHTMLCoreProviders(),
    ...createHTMLSandboxProviders()
  ];
}

export * from "../../core";