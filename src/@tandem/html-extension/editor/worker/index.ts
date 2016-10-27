// note unused imports - fixes --declaration issue with typescript

import { MimeTypeDependency } from "@tandem/common";
import { createHTMLCoreDependencies, createHTMLSandboxDependencies } from "../../index";
import {
  BundlerLoaderFactoryDependency,
  ContentEditorFactoryDependency,
  SandboxModuleEvaluatorFactoryDependency,
} from "@tandem/sandbox";

import { SyntheticDOMElementClassDependency } from "@tandem/synthetic-browser";

export const createHTMLEditorWorkerDependencies = () => {
  return [
    ...createHTMLCoreDependencies(),
    ...createHTMLSandboxDependencies()
  ];
}

export * from "../../core";