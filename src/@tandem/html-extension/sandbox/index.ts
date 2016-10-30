import { CSSEditor, MarkupEditor } from "@tandem/synthetic-browser";
import { CSS_MIME_TYPE, HTML_MIME_TYPE, JS_MIME_TYPE } from "@tandem/common";

import { HTMLBundleLoader } from "./html-loader";
import { HTMLASTEvaluator } from "./html-evaluator";
import { CSSBundleLoader } from "./css-loader";
import { CSSASTEvaluator } from "./css-evaluator";

export * from "./html-loader";
export * from "./html-evaluator";
export * from "./css-loader";
export * from "./css-evaluator";

import {
  BundlerLoaderFactoryProvider,
  ContentEditorFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

export function createHTMLSandboxDependencies() {
  return [
    // bundle loaders
    new BundlerLoaderFactoryProvider(HTML_MIME_TYPE, HTMLBundleLoader),
    new BundlerLoaderFactoryProvider(CSS_MIME_TYPE, CSSBundleLoader),

    // sandbox evaluators
    new SandboxModuleEvaluatorFactoryProvider(HTML_MIME_TYPE, HTMLASTEvaluator),
    new SandboxModuleEvaluatorFactoryProvider(CSS_MIME_TYPE, CSSASTEvaluator),

    // edit consumers
    new ContentEditorFactoryProvider(CSS_MIME_TYPE, CSSEditor),
    new ContentEditorFactoryProvider(HTML_MIME_TYPE, MarkupEditor),
  ];
}