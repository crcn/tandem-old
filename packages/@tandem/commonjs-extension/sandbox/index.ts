import { JS_MIME_TYPE, MimeTypeProvider } from "@tandem/common";
import { CommonJSSandboxEvaluator } from "./commonjs-evaluator";
import { CommonJSandboxLoader } from "./commonjs-loader";
import { 
  DependencyLoaderFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "@tandem/sandbox";

export const createJavaScriptSandboxProviders = () => {
  return [
    new MimeTypeProvider("js", JS_MIME_TYPE),
    // new DependencyLoaderFactoryProvider(JS_MIME_TYPE, CommonJSandboxLoader),
    new SandboxModuleEvaluatorFactoryProvider(JS_MIME_TYPE, CommonJSSandboxEvaluator),
  ];
}

export * from "./commonjs-evaluator";