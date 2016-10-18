import {
  IActor,
  Dependencies,
  MainBusDependency,
} from "@tandem/common";

import { IFileSystem } from "./file-system";
import { FileSystemDependency } from "./dependencies";

export class SandboxLoader {

  private _fileSystem: IFileSystem;
  private _resolver: any;

  constructor(private _dependencies: Dependencies) {
    this._fileSystem = FileSystemDependency.getInstance(_dependencies);
  }

  async load(url: string) {

  }
}