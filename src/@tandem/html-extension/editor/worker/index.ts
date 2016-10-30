// note unused imports - fixes --declaration issue with typescript

import { MimeTypeProvider } from "@tandem/common";
import { createHTMLCoreDependencies, createHTMLSandboxDependencies } from "../../index";
import {
  BundlerLoaderFactoryProvider,
  ContentEditorFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

import { SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";

export const createHTMLEditorWorkerDependencies = () => {
  return [
    ...createHTMLCoreDependencies(),
    ...createHTMLSandboxDependencies()
  ];
}

export * from "../../core";