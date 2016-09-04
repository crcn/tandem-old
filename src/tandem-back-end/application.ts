import * as path from "path";
import { Application } from "tandem-common/application";

import { dependency as dbServiceDependency } from "./services/db";
import { dependency as fileServicerDependency } from "./services/file";
import { dependency as stdinServiceDependency } from "./services/stdin";
import { dependency as upsertServiceDependency } from "./services/upsert";
import { dependency as frontEndServiceDependency } from "./services/front-end";
import { dependency as projectServiceDependency } from "./services/project";

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
    );
  }
}
