import "reflect-metadata";

import * as path from "path";
import { Application } from "@tandem/common/application";

import { dbServiceDependency } from "./services/db";
import { sync as getPackagePath } from "package-path";
import { fileServicerDependency } from "./services/file";
import { stdinServiceDependency } from "./services/stdin";
import { upsertServiceDependency } from "./services/upsert";
import { projectServiceDependency } from "./services/project";
import { frontEndServiceDependency } from "./services/front-end";
import { resolverServiceDependency } from "./services/resolver";

import { tetherBackEndDependencies } from "@tandem/tether-back-end";

export default class ServerApplication extends Application {
  constructor(config) {

    const entryNames = ["editor"];
    const entries = {};

    for (const entryName of entryNames) {
      const packagePath = getPackagePath(require.resolve(`@tandem/${entryName}`));
      const bundlePath   = packagePath + "/" + require(packagePath + "/package.json").bundle;
      Object.assign(entries, {
        [entryName]: require.resolve(bundlePath)
      });
    }

    super(Object.assign({
      entries: entries
    }, config));
  }
  registerDependencies() {
    super.registerDependencies();
    this.dependencies.register(
      dbServiceDependency,
      fileServicerDependency,
      stdinServiceDependency,
      upsertServiceDependency,
      projectServiceDependency,
      frontEndServiceDependency,
      resolverServiceDependency,
      tetherBackEndDependencies,
    );
  }
}
