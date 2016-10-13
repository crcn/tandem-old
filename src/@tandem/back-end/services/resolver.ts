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
    let { filePath, relativeFilePath, extensions, directories } = action;

    let dir;

    if (relativeFilePath) {
      dir = path.dirname(relativeFilePath);
      const pkgPath = pkgpath.sync(relativeFilePath);
      const pkg = require(pkgPath + "/package.json");

      // check browser flag in package.json

      if (!/^(\.|\/)/.test(filePath)) {
        dir = pkgPath;
      }

      if (pkg && pkg.browser && pkg.browser[filePath] != null) {
        filePath = pkg.browser[filePath];
      }

      directories.push(dir + "/node_modules");

      if (<boolean><any>filePath === false) return new EmptyResponse();
    } else {
      dir = process.cwd();
    }

    return resolve.sync(filePath, {
      basedir: dir,
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
