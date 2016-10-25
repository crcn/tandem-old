import "reflect-metadata";

import * as path from "path";
import { Application } from "@tandem/common/application";

import { dbServiceDependency } from "./services/db";
import { sockServiceDependency } from "./services/sock";
import { sync as getPackagePath } from "package-path";
import { fileServicerDependency } from "./services/file";
import { stdinServiceDependency } from "./services/stdin";
import { upsertServiceDependency } from "./services/upsert";
import { projectServiceDependency } from "./services/project";
import { frontEndServiceDependency } from "./services/front-end";
import { resolverServiceDependency } from "./services/resolver";

import { htmlExtensionDependencies } from "@tandem/html-extension";
import {
  LocalFileSystem,
  LocalFileResolver,
  FileCacheDependency,
  FileSystemDependency,
  createSandboxDependencies
} from "@tandem/sandbox";

export default class ServerApplication extends Application {
  constructor(config) {

    const entryNames = ["editor"];
    const entries = {};

    for (const entryName of entryNames) {
      const packagePath = getPackagePath(require.resolve(`@tandem/${entryName}`));
      const bundlePath   = packagePath + "/" + require(packagePath + "/package.json").browser;
      Object.assign(entries, {
        [entryName]: require.resolve(bundlePath)
      });
    }

    super(Object.assign({
      cwd: process.cwd(),
      entries: entries
    }, config));
  }
  registerDependencies() {
    super.registerDependencies();
    this.dependencies.register(
      fileServicerDependency,
      dbServiceDependency,
      stdinServiceDependency,
      upsertServiceDependency,
      projectServiceDependency,
      frontEndServiceDependency,
      resolverServiceDependency,
      sockServiceDependency,
      htmlExtensionDependencies,
      createSandboxDependencies(new LocalFileSystem(), new LocalFileResolver()),
    );
  }
}
