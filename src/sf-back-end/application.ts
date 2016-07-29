import * as path from "path";
import { Application } from "sf-common/application";

import { fragment as dbServiceDependency } from "./services/db";
import { fragment as fileServicerDependency } from "./services/file";
import { fragment as stdinServiceDependency } from "./services/stdin";
import { fragment as upsertServiceDependency } from "./services/upsert";
import { fragment as frontEndServiceDependency } from "./services/front-end";

export default class ServerApplication extends Application {
  constructor(config) {
    super(Object.assign({
      frontEndEntry: require.resolve("sf-front-end")
    }, config));
  }
  registerDependencies() {
    super.registerDependencies();
    this.dependencies.register(
      dbServiceDependency,
      fileServicerDependency,
      stdinServiceDependency,
      upsertServiceDependency,
      frontEndServiceDependency
    );
  }
}
