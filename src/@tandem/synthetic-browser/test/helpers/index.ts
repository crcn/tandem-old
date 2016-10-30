import { Injector } from "@tandem/common";
import { SyntheticBrowser } from "@tandem/synthetic-browser";
import { createSandboxDependencies, IFileResolver, IFileSystem } from "@tandem/sandbox";
import { createCoreApplicationDependencies } from "@tandem/core";

export function createMockBrowser() {
  const deps = createSandboxDependencies();
  return new SyntheticBrowser(deps);
}