import { IFileSystem } from "./file-system";

export interface IFileResolver {
  resolve(fileName: string, cwd?: string): Promise<string>;
}

export class FileResolver implements IFileResolver {

  private _resolved: any;

  constructor(private _fileSystem: IFileSystem) {
    this.clearCache();
  }

  clearCache() {
    this._resolved = {};
  }

  resolve(fileName: string, cwd?: string) {
    return Promise.resolve("");
  }
}