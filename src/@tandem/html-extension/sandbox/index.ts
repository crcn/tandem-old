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
  BundlerLoaderFactoryDependency,
  ContentEditorFactoryDependency,
  SandboxModuleEvaluatorFactoryDependency,
} from "@tandem/sandbox";

export const htmlSandboxDependencies = [

  // bundle loaders
  new BundlerLoaderFactoryDependency(HTML_MIME_TYPE, HTMLBundleLoader),
  new BundlerLoaderFactoryDependency(CSS_MIME_TYPE, CSSBundleLoader),

  // sandbox evaluators
  new SandboxModuleEvaluatorFactoryDependency(undefined, HTML_MIME_TYPE, HTMLASTEvaluator),
  new SandboxModuleEvaluatorFactoryDependency(undefined, CSS_MIME_TYPE, CSSASTEvaluator),

  // edit consumers
  new ContentEditorFactoryDependency(CSS_MIME_TYPE, CSSEditor),
  new ContentEditorFactoryDependency(HTML_MIME_TYPE, MarkupEditor),
]