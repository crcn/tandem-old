import { IActor } from "@tandem/common/actors";
import { UpsertBus } from "@tandem/common/busses";
import { IApplication } from "@tandem/common/application";
import { ResolveAction } from "@tandem/common/actions";
import { BaseApplicationService } from "@tandem/common/services";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";
import * as resolve from "resolve";
import * as path from "path";
import * as pkgpath from "package-path";
import { EmptyResponse } from "mesh";

// TODO - move this to @tandem/sandbox
export default class ResolverService extends BaseApplicationService<IApplication> {

  /**
   */

  [ResolveAction.RESOLVE](action: ResolveAction): any {
    const { config } = this.app;
    let { relativePath, cwd, extensions, directories } = action;

    if (cwd) {
      const pkgPath = pkgpath.sync(cwd);
      const pkg = require(pkgPath + "/package.json");

      // check browser flag in package.json

      if (!/^(\.|\/)/.test(relativePath)) {
        cwd = pkgPath;
      }

      if (pkg && pkg.browser && pkg.browser[relativePath] != null) {
        relativePath = pkg.browser[relativePath];
      }

      directories.push(cwd + "/node_modules");

      if (<boolean><any>relativePath === false) return new EmptyResponse();
    } else {
      cwd = process.cwd();
    }

    return resolve.sync(relativePath, {
      basedir: cwd,
      extensions: extensions,
      paths: directories,

      // moduleDirectory is required, but it foos with
      // dependency resolution. Solution: give a directory that doesn't have anything
      moduleDirectory: "/i/should/not/exist",

      packageFilter: (pkg, fileName) => {
        const main = pkg.browser ? pkg.browser[pkg.main] || pkg.browser : pkg.main;
        return {
          main: main
        }
      }
    });
  }
}

export const resolverServiceDependency = new ApplicationServiceDependency("resolver", ResolverService);
