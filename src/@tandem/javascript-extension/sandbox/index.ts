import { JS_MIME_TYPE } from "@tandem/common";
import { CommonJSSandboxEvaluator } from "./commonjs-evaluator";
import { SandboxModuleEvaluatorFactoryProvider } from "@tandem/sandbox";

export const createJavaScriptSandboxProviders = () => {
  return new SandboxModuleEvaluatorFactoryProvider(JS_MIME_TYPE, CommonJSSandboxEvaluator)
}

export * from "./commonjs-evaluator";