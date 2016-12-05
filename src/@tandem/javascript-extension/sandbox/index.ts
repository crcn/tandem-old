import { JS_MIME_TYPE, MimeTypeProvider } from "@tandem/common";
import { CommonJSSandboxEvaluator } from "./commonjs-evaluator";
import { SandboxModuleEvaluatorFactoryProvider } from "@tandem/sandbox";

export const createJavaScriptSandboxProviders = () => {
  return [
    new MimeTypeProvider("js", JS_MIME_TYPE),
    new SandboxModuleEvaluatorFactoryProvider(JS_MIME_TYPE, CommonJSSandboxEvaluator),
  ];
}

export * from "./commonjs-evaluator";