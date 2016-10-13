import { PEG_MIME_TYPE } from "./constants";
import { PegJSSandboxModule } from "./sandbox";
import { SandboxModuleFactoryDependency } from "@tandem/sandbox";
import { JS_MIME_TYPE, MimeTypeDependency } from "@tandem/common";

export const pegjsExtensionDependencies = [
  new SandboxModuleFactoryDependency(JS_MIME_TYPE, PEG_MIME_TYPE, PegJSSandboxModule),
  new MimeTypeDependency("peg", PEG_MIME_TYPE)
];