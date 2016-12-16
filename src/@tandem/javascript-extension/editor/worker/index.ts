import { MimeTypeProvider } from "@tandem/common";
import { createJavaScriptSandboxProviders } from "../../index";
import { SandboxModuleEvaluatorFactoryProvider, DependencyLoaderFactoryProvider } from "@tandem/sandbox";
export const createJavaScriptWorkerProviders = createJavaScriptSandboxProviders;