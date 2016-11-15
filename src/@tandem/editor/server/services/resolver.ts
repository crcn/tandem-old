import { inject } from "@tandem/common";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/core";
import { IFileResolver, ResolveFileAction, FileResolverProvider } from "@tandem/sandbox";

// TODO - move this to @tandem/sandbox
export class ResolverService extends CoreApplicationService<IEdtorServerConfig> {

  @inject(FileResolverProvider.ID)
  private _resolver: IFileResolver;

  /**
   */

  [ResolveFileAction.RESOLVE_FILE](action: ResolveFileAction): any {
    return this._resolver.resolve(action.relativePath, action.cwd, action.options);
  }
}

