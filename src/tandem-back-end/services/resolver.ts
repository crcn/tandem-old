import { IActor } from "tandem-common/actors";
import { UpsertBus } from "tandem-common/busses";
import { IApplication } from "tandem-common/application";
import { ResolveAction } from "tandem-common/actions";
import { BaseApplicationService } from "tandem-common/services";
import { ApplicationServiceDependency } from "tandem-common/dependencies";
import * as resolve from "resolve";
import * as path from "path";

export default class ResolverService extends BaseApplicationService<IApplication> {

  /**
   */

  [ResolveAction.RESOLVE](action: ResolveAction) {
    const { config } = this.app;
    const { filePath, relativeFilePath } = action;

    const dir = relativeFilePath ? path.dirname(relativeFilePath) : process.cwd();

    return resolve.sync(filePath, {
      basedir: dir,
      extensions: config.extensions,
      paths: config.rootDirectories
    });
  }
}

export const resolverServiceDependency = new ApplicationServiceDependency("resolver", ResolverService);
