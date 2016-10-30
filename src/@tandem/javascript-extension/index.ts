import { JS_MIME_TYPE } from "@tandem/common";
import { CommonJSSandboxEvaluator } from "./sandbox";
import { SandboxModuleEvaluatorFactoryProvider } from "@tandem/sandbox";

export const createJavaScriptSandboxDependencies = () => {
  return [
    new SandboxModuleEvaluatorFactoryProvider(JS_MIME_TYPE, CommonJSSandboxEvaluator)
  ];
}
