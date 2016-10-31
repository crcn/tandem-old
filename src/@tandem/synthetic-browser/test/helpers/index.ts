import { Injector } from "@tandem/common";
import { SyntheticBrowser } from "@tandem/synthetic-browser";
import { createSandboxProviders, IFileResolver, IFileSystem } from "@tandem/sandbox";
import { createCoreApplicationProviders } from "@tandem/core";

export function createMockBrowser() {
  const deps = createSandboxProviders();
  return new SyntheticBrowser(new Injector(deps));
}