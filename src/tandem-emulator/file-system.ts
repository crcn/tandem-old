import {
  IActor,
  IDisposable,
  Dependencies,
  ReadFileAction,
  WatchFileAction,
  MainBusDependency,
  IReadFileActionResponseData,
  UpdateTemporaryFileContentAction,
} from "tandem-common";

export interface IFileSystem {
  readFile(path: string): Promise<IReadFileActionResponseData>;
  writeFile(path: string, content: any): Promise<void>;
  watchFile(path: string, onChange: Function): IDisposable;
}

export class FileSystem implements IFileSystem {

  private _bus: IActor;

  constructor(dependencies: Dependencies) {
    this._bus = MainBusDependency.getInstance(dependencies);
  }

  async readFile(path: string) {
    return ReadFileAction.execute({ path }, this._bus);
  }

  async writeFile(path: string, content: string) {
    return null;
  }

  watchFile(path: string, onFileChange: Function): IDisposable {
    return WatchFileAction.execute(path, this._bus, onFileChange);
  }
}