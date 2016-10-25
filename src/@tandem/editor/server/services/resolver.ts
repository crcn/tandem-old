import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/editor/core";
import { IFileResolver, ResolveFileAction, FileResolverDependency } from "@tandem/sandbox";

// TODO - move this to @tandem/sandbox
export class ResolverService extends CoreApplicationService<IEdtorServerConfig> {

  @inject(FileResolverDependency.ID)
  private _resolver: IFileResolver;

  /**
   */

  [ResolveFileAction.RESOLVE_FILE](action: ResolveFileAction): any {
    return this._resolver.resolve(action.relativePath, action.cwd, action.options);
  }
}

