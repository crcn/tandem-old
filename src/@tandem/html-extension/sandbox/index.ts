import { CSSEditor, MarkupEditor } from "@tandem/synthetic-browser";
import { CSS_MIME_TYPE, HTML_MIME_TYPE, JS_MIME_TYPE } from "@tandem/common";

import { HTMLDependencyLoader } from "./html-loader";
import { HTMLASTEvaluator } from "./html-evaluator";
import { CSSDependencyLoader } from "./css-loader";
import { CSSASTEvaluator } from "./css-evaluator";

export * from "./html-loader";
export * from "./html-evaluator";
export * from "./css-loader";
export * from "./css-evaluator";

import {
  DependencyLoaderFactoryProvider,
  ContentEditorFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

export function createHTMLSandboxProviders() {
  return [
    // dependency graph loaders
    new DependencyLoaderFactoryProvider(HTML_MIME_TYPE, HTMLDependencyLoader),
    new DependencyLoaderFactoryProvider(CSS_MIME_TYPE, CSSDependencyLoader),

    // sandbox evaluators
    new SandboxModuleEvaluatorFactoryProvider(HTML_MIME_TYPE, HTMLASTEvaluator),
    new SandboxModuleEvaluatorFactoryProvider(CSS_MIME_TYPE, CSSASTEvaluator),

    // edit consumers
    new ContentEditorFactoryProvider(CSS_MIME_TYPE, CSSEditor),
    new ContentEditorFactoryProvider(HTML_MIME_TYPE, MarkupEditor),
  ];
}