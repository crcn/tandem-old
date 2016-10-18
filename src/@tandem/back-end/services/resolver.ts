import { IActor } from "@tandem/common/actors";
import { UpsertBus } from "@tandem/common/busses";
import { IApplication } from "@tandem/common/application";
import { BaseApplicationService } from "@tandem/common/services";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";
import * as resolve from "resolve";
import * as path from "path";
import * as pkgpath from "package-path";
import { EmptyResponse } from "mesh";
import { LocalFileResolver, ResolveFileAction } from "@tandem/sandbox";

// TODO - move this to @tandem/sandbox
export default class ResolverService extends BaseApplicationService<IApplication> {

  private _resolver: LocalFileResolver;

  constructor() {
    super();
    this._resolver = new LocalFileResolver(this.app.dependencies);
  }

  /**
   */

  [ResolveFileAction.RESOLVE_FILE](action: ResolveFileAction): any {
    return this._resolver.resolve(action.relativePath, action.cwd, action.options);
  }
}

export const resolverServiceDependency = new ApplicationServiceDependency("resolver", ResolverService);
