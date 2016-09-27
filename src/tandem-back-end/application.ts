import * as path from "path";
import { Application } from "tandem-common/application";

import { dbServiceDependency } from "./services/db";
import { fileServicerDependency } from "./services/file";
import { stdinServiceDependency } from "./services/stdin";
import { upsertServiceDependency } from "./services/upsert";
import { projectServiceDependency } from "./services/project";
import { frontEndServiceDependency } from "./services/front-end";
import { resolverServiceDependency } from "./services/resolver";

export default class ServerApplication extends Application {
  constructor(config) {
    super(Object.assign({
      frontEndEntry: require.resolve("tandem-front-end")
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
    );
  }
}
