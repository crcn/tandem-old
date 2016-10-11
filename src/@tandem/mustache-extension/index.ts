import { HTML_MIME_TYPE, MimeTypeDependency } from "@tandem/common";
import { SandboxModuleFactoryDependency } from "@tandem/sandbox";
import { MustacheSandboxModule } from "./sandbox";
import { MUSTACHE_MIME_TYPE } from "./constants";

export const mustacheExtensionDependencies = [
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, MUSTACHE_MIME_TYPE, MustacheSandboxModule),
  new MimeTypeDependency("mu", MUSTACHE_MIME_TYPE)
];
