import { JS_MIME_TYPE } from "@tandem/common";
import { CommonJSSandboxEvaluator } from "./sandbox";
import { SandboxModuleEvaluatorFactoryDependency } from "@tandem/sandbox";

export const createJavaScriptSandboxDependencies = () => {
  return [
    new SandboxModuleEvaluatorFactoryDependency(JS_MIME_TYPE, CommonJSSandboxEvaluator)
  ];
}
